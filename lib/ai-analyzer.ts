import { AIAnalysisResult, PriorityLevel } from './types';

// Fallback Deterministic AI Analyzer for Demo Mode
export function analyzeComplaintFallback(description: string, inputLocation?: string): AIAnalysisResult {
  const text = description.toLowerCase();
  const locationText = inputLocation && inputLocation.trim().length > 0 ? inputLocation.trim() : 'Hyderabad';

  // 1. Pothole / Road damage near MJCET / accidents
  if (text.includes('pothole') || (text.includes('road') && (text.includes('accident') || text.includes('mjcet') || text.includes('damaged') || text.includes('hole')))) {
    const isAccident = text.includes('accident') || text.includes('injury') || text.includes('severe');
    const severity = isAccident ? 92 : 81;
    return {
      category: 'Road Infrastructure',
      issue: text.includes('pothole') ? 'Pothole' : 'Road Damage',
      severity,
      priority: severity,
      priorityLevel: severity >= 80 ? 'HIGH' : severity >= 50 ? 'MEDIUM' : 'LOW',
      department: 'Roads & Infrastructure',
      location: locationText,
      summary: isAccident
        ? 'Large pothole reported in a high-traffic area with multiple accidents and severe safety risk to commuters.'
        : 'Road damaged near public transit point causing traffic congestion and vehicle hazard.',
      recommendedAction: 'Inspect the reported location immediately and dispatch road repair crew for emergency asphalt patching.',
      reasoning: isAccident
        ? 'High severity assigned due to reported accidents, structural road degradation, and active threat to public safety.'
        : 'High priority due to heavy commuter density and potential for traffic disruption or vehicle damage.'
    };
  }

  // 2. Water leakage / Mehdipatnam / Sewage
  if (text.includes('water') || text.includes('leak') || text.includes('pipe') || text.includes('sewage') || text.includes('drain') || text.includes('mehdipatnam')) {
    const isMajor = text.includes('sewage') || text.includes('leakage') || text.includes('three days') || text.includes('overflow');
    const severity = isMajor ? 87 : 68;
    return {
      category: 'Water & Sanitation',
      issue: text.includes('sewage') ? 'Sewage Overflow' : 'Water Leakage',
      severity,
      priority: severity,
      priorityLevel: severity >= 80 ? 'HIGH' : severity >= 50 ? 'MEDIUM' : 'LOW',
      department: 'Water & Sanitation',
      location: locationText.includes('Mehdipatnam') ? locationText : `${locationText}`,
      summary: 'Pipeline leak/sewage issue reported causing water loss, roadway erosion, and contamination risk.',
      recommendedAction: 'Isolate main supply valve if required, dispatch hydraulic pipeline engineering team to locate and seal leak.',
      reasoning: 'High severity due to multi-day water loss, risk of road sub-base collapse, and potential public health hazards.'
    };
  }

  // 3. Streetlight / Dark / Electricity / College Road
  if (text.includes('streetlight') || text.includes('light') || text.includes('dark') || text.includes('electric') || text.includes('power') || text.includes('wire')) {
    const isDanger = text.includes('wire') || text.includes('spark') || text.includes('transformer');
    const severity = isDanger ? 89 : 61;
    const priorityLevel: PriorityLevel = severity >= 80 ? 'HIGH' : severity >= 50 ? 'MEDIUM' : 'LOW';
    return {
      category: 'Electricity',
      issue: isDanger ? 'Dangerous Electrical Hazard' : 'Streetlight Failure',
      severity,
      priority: severity,
      priorityLevel,
      department: 'Electricity',
      location: locationText,
      summary: isDanger
        ? 'Exposed high-voltage electrical lines or sparking equipment posing immediate safety hazard.'
        : 'Non-functional streetlights over several nights reducing visibility and safety for pedestrians.',
      recommendedAction: isDanger
        ? 'Deploy emergency electrical crew immediately to isolate power supply and repair line.'
        : 'Dispatch electrical maintenance technician to replace faulty luminaires and inspect feeder pillar.',
      reasoning: isDanger
        ? 'Critical safety risk from live electrical lines in public space.'
        : 'Medium priority based on night-time visibility concerns and public safety standards.'
    };
  }

  // 4. Garbage / Waste / Uncollected
  if (text.includes('garbage') || text.includes('waste') || text.includes('trash') || text.includes('dump') || text.includes('cleaning')) {
    const isOverflowing = text.includes('four days') || text.includes('week') || text.includes('smell') || text.includes('overflow');
    const severity = isOverflowing ? 48 : 38; // 0-49 is LOW according to spec prompt
    const priorityLevel: PriorityLevel = severity >= 80 ? 'HIGH' : severity >= 50 ? 'MEDIUM' : 'LOW';
    return {
      category: 'Waste Management',
      issue: 'Garbage Accumulation',
      severity,
      priority: severity,
      priorityLevel,
      department: 'Sanitation',
      location: locationText,
      summary: 'Uncollected solid waste reported on street causing hygiene concerns and odor.',
      recommendedAction: 'Route municipal sanitation truck for scheduled waste collection and site cleanup.',
      reasoning: 'Categorized as LOW priority (38/100) as it presents localized sanitation concern without immediate structural or life safety threat.'
    };
  }

  // 5. Public Safety / Traffic / General
  if (text.includes('traffic') || text.includes('signal') || text.includes('danger') || text.includes('police') || text.includes('crime') || text.includes('manhole')) {
    const severity = text.includes('manhole') ? 95 : 85;
    return {
      category: 'Public Safety',
      issue: text.includes('manhole') ? 'Open Manhole Hazard' : 'Traffic Signal Malfunction',
      severity,
      priority: severity,
      priorityLevel: 'HIGH',
      department: 'Public Safety',
      location: locationText,
      summary: 'Critical infrastructure failure posing immediate threat to motorists and pedestrians.',
      recommendedAction: 'Place warning barricades immediately and send emergency repair team.',
      reasoning: 'Rated HIGH priority due to direct risk of falling accidents or vehicle collisions.'
    };
  }

  // Generic fallback for any other input
  const defaultSeverity = 65;
  return {
    category: 'Other',
    issue: 'Public Infrastructure Concern',
    severity: defaultSeverity,
    priority: defaultSeverity,
    priorityLevel: 'MEDIUM',
    department: 'Municipal Services',
    location: locationText,
    summary: `Citizen complaint received regarding: "${description.slice(0, 80)}..."`,
    recommendedAction: 'Assign local field inspector to verify issue details and determine remedial action.',
    reasoning: 'Assigned standard MEDIUM priority baseline for unclassified municipal report.'
  };
}

// Main AI analysis runner (Gemini API with fallback)
export async function analyzeComplaint(description: string, location?: string): Promise<AIAnalysisResult> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Artificial slight delay for realistic AI analysis simulation feel
    await new Promise((resolve) => setTimeout(resolve, 900));
    return analyzeComplaintFallback(description, location);
  }

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are CivicAI, an expert public infrastructure grievance classifier.
Analyze the following citizen complaint and return ONLY a valid raw JSON object (no markdown formatting, no code blocks) matching this schema:

{
  "category": "Road Infrastructure" | "Water & Sanitation" | "Electricity" | "Waste Management" | "Public Safety" | "Public Transport" | "Other",
  "issue": "Short name of issue e.g. Pothole, Water Leakage, Streetlight Failure",
  "severity": number between 0 and 100,
  "priority": number between 0 and 100 (same as severity),
  "priorityLevel": "HIGH" (80-100) or "MEDIUM" (50-79) or "LOW" (0-49),
  "department": "Roads & Infrastructure" | "Water & Sanitation" | "Electricity" | "Sanitation" | "Public Safety" | "Public Transport" | "Municipal Services",
  "location": "Location from text or provided default",
  "summary": "1-2 sentence AI summary of issue",
  "recommendedAction": "Specific actionable recommendation for municipal crew",
  "reasoning": "Reasoning for the severity and priority score"
}

Complaint description: "${description}"
Location: "${location || 'Hyderabad'}"`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty response from Gemini');

    const cleanJsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJsonText);

    // Validate properties
    return {
      category: parsed.category || 'Road Infrastructure',
      issue: parsed.issue || 'Infrastructure Issue',
      severity: typeof parsed.severity === 'number' ? parsed.severity : 75,
      priority: typeof parsed.priority === 'number' ? parsed.priority : 75,
      priorityLevel: (parsed.severity >= 80 ? 'HIGH' : parsed.severity >= 50 ? 'MEDIUM' : 'LOW') as PriorityLevel,
      department: parsed.department || 'Roads & Infrastructure',
      location: parsed.location || location || 'Hyderabad',
      summary: parsed.summary || 'Public infrastructure issue reported.',
      recommendedAction: parsed.recommendedAction || 'Inspect location and initiate repair.',
      reasoning: parsed.reasoning || 'Severity score evaluated based on reported urgency.'
    };
  } catch (err) {
    console.warn('Gemini API call failed or unconfigured, falling back to local analyzer:', err);
    return analyzeComplaintFallback(description, location);
  }
}
