import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import * as cheerio from 'cheerio';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);

    // Remove script and style elements
    $('script, style, nav, footer, iframe').remove();

    // Extract useful information
    const title = $('title').text() || '';
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1Tags = $('h1').map((_, el) => $(el).text()).get().join(' | ');
    const h2Tags = $('h2').map((_, el) => $(el).text()).get().slice(0, 10).join(' | ');
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 5000);

    return `
URL: ${url}
Title: ${title}
Meta Description: ${metaDescription}
H1 Tags: ${h1Tags}
H2 Tags: ${h2Tags}
Body Content (excerpt): ${bodyText}
    `.trim();
  } catch (error) {
    throw new Error('Failed to fetch website content');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Scrape website content
    const websiteContent = await scrapeWebsite(url);

    // Analyze with Claude
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      temperature: 1,
      messages: [
        {
          role: 'user',
          content: `You are a complete AI marketing expert team analyzing a website. Provide comprehensive marketing insights and strategies.

Website Content:
${websiteContent}

Provide a detailed analysis covering these 10 areas (be specific, actionable, and comprehensive for each):

1. BRAND ANALYSIS: Analyze the brand positioning, messaging, unique value proposition, brand voice, and visual identity. What makes this brand stand out? What are the strengths and weaknesses?

2. TARGET AUDIENCE: Define detailed customer personas including demographics, psychographics, pain points, motivations, and buying behaviors. Who should this brand target?

3. COMPETITOR INSIGHTS: Identify likely competitors and analyze competitive advantages/disadvantages. What market opportunities exist?

4. CONTENT STRATEGY: Provide a detailed content marketing plan including blog topics, video ideas, content pillars, content calendar recommendations, and storytelling approaches.

5. SEO RECOMMENDATIONS: Analyze current SEO status and provide specific keyword strategies, on-page optimization recommendations, technical SEO improvements, and link building strategies.

6. SOCIAL MEDIA STRATEGY: Recommend platform-specific strategies for Instagram, LinkedIn, Twitter, TikTok, etc. Include content types, posting frequency, engagement tactics, and growth strategies.

7. PAID ADVERTISING: Create a paid advertising strategy including Google Ads, Facebook/Instagram Ads, LinkedIn Ads recommendations. Include targeting, budget allocation, and campaign ideas.

8. EMAIL MARKETING: Design an email marketing strategy including list building tactics, segmentation strategies, automation sequences, and specific email campaign ideas.

9. CONVERSION OPTIMIZATION: Analyze the website for conversion potential and provide specific CRO recommendations including landing page improvements, CTAs, user experience enhancements, and funnel optimization.

10. KPI METRICS: Define specific KPIs to track, measurement frameworks, analytics setup recommendations, and reporting strategies.

Format your response as a JSON object with these exact keys:
{
  "brandAnalysis": "detailed analysis here",
  "targetAudience": "detailed analysis here",
  "competitorInsights": "detailed analysis here",
  "contentStrategy": "detailed analysis here",
  "seoRecommendations": "detailed analysis here",
  "socialMediaStrategy": "detailed analysis here",
  "paidAdvertising": "detailed analysis here",
  "emailMarketing": "detailed analysis here",
  "conversionOptimization": "detailed analysis here",
  "kpiMetrics": "detailed analysis here"
}

Make each section comprehensive (200-400 words), specific to this website, and immediately actionable. Use bullet points, numbers, and clear structure within each section.`
        }
      ]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse the JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ analysis });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze website' },
      { status: 500 }
    );
  }
}
