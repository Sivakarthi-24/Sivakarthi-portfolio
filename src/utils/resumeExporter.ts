import { jsPDF } from 'jspdf';
import {
  FEATURED_PROJECTS,
  PROFILE,
  SKILL_GROUPS,
} from '../data/portfolioData';

export type ResumeEdition = 'signature-dark' | 'clean-paper';
export type ResumeFormat = 'pdf' | 'doc' | 'md' | 'txt' | 'json';

const SUMMARY_TEXT =
  'Electronics and Communication Engineering student at Panimalar Engineering College interested in Embedded Systems, IoT, software development, UI/UX, web designing, programming, and AI. Focused on learning by building and publishing real projects on GitHub.';

function triggerBlobDownload(content: BlobPart, mimeType: string, filename: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function loadPortraitDataUrl(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const targetW = 240;
        const targetH = 290;
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        // Cover-fit centered toward top so portrait framing matches UI
        const scale = Math.max(targetW / img.width, targetH / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const offsetX = (targetW - drawW) / 2;
        const offsetY = Math.min(0, (targetH - drawH) * 0.15);
        ctx.fillStyle = '#E9EDF2';
        ctx.fillRect(0, 0, targetW, targetH);
        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export async function downloadResumePdf(edition: ResumeEdition): Promise<void> {
  const isDark = edition === 'signature-dark';
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageW = 210;
  const pageH = 297;

  // Palette matching Signature Dark / Clean Paper dossier editions
  const colors = isDark
    ? {
        bg: [16, 17, 23] as [number, number, number],
        mastheadBg: [11, 12, 18] as [number, number, number],
        sidebarBg: [19, 21, 30] as [number, number, number],
        text: [244, 242, 248] as [number, number, number],
        muted: [164, 164, 179] as [number, number, number],
        accent: [164, 119, 255] as [number, number, number],
        sky: [80, 201, 245] as [number, number, number],
        border: [44, 47, 64] as [number, number, number],
      }
    : {
        bg: [251, 251, 253] as [number, number, number],
        mastheadBg: [244, 245, 249] as [number, number, number],
        sidebarBg: [247, 248, 251] as [number, number, number],
        text: [14, 16, 24] as [number, number, number],
        muted: [75, 80, 99] as [number, number, number],
        accent: [92, 53, 184] as [number, number, number],
        sky: [14, 116, 144] as [number, number, number],
        border: [215, 217, 226] as [number, number, number],
      };

  // Full page background
  doc.setFillColor(...colors.bg);
  doc.rect(0, 0, pageW, pageH, 'F');

  // Masthead band
  const mastheadH = 48;
  doc.setFillColor(...colors.mastheadBg);
  doc.rect(0, 0, pageW, mastheadH, 'F');

  // Top gradient-inspired accent stripe
  doc.setFillColor(...colors.accent);
  doc.rect(0, 0, pageW * 0.55, 1.5, 'F');
  doc.setFillColor(...colors.sky);
  doc.rect(pageW * 0.55, 0, pageW * 0.45, 1.5, 'F');

  // Masthead bottom hairline
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.3);
  doc.line(0, mastheadH, pageW, mastheadH);

  // Portrait embed
  const portraitData = await loadPortraitDataUrl(PROFILE.portraitUrl);
  const photoX = 12;
  const photoY = 8;
  const photoW = 26;
  const photoH = 32;

  if (portraitData) {
    doc.addImage(portraitData, 'JPEG', photoX, photoY, photoW, photoH);
    doc.setDrawColor(...colors.border);
    doc.rect(photoX, photoY, photoW, photoH, 'S');
  }

  // Name & Header Details
  const headerX = portraitData ? 44 : 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...colors.accent);
  doc.text('CURRICULUM VITAE', headerX, 13);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(...colors.text);
  doc.text(PROFILE.name, headerX, 21);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(...colors.muted);
  doc.text(PROFILE.roleLine, headerX, 27.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.muted);
  doc.text(`${PROFILE.location}  ·  ${PROFILE.email}`, headerX, 34);

  // Clickable GitHub & LinkedIn links (WinAnsi-safe glyphs + exact text width spacing)
  const ghLabel = `github.com/${PROFILE.githubHandle}`;
  const sepLabel = '  ·  ';
  doc.setTextColor(...colors.sky);
  doc.textWithLink(ghLabel, headerX, 40, {
    url: PROFILE.githubUrl,
  });
  const ghWidth = doc.getTextWidth(ghLabel);
  doc.setTextColor(...colors.muted);
  doc.text(sepLabel, headerX + ghWidth, 40);
  const sepWidth = doc.getTextWidth(sepLabel);
  doc.setTextColor(...colors.accent);
  doc.textWithLink('linkedin.com/in/sivakarthi-annamalai', headerX + ghWidth + sepWidth, 40, {
    url: PROFILE.linkedinUrl,
  });

  // Two-column layout geometry
  const sidebarW = 68;
  const contentStartY = mastheadH;
  const contentH = pageH - contentStartY;

  // Sidebar background & divider
  doc.setFillColor(...colors.sidebarBg);
  doc.rect(0, contentStartY, sidebarW, contentH, 'F');
  doc.setDrawColor(...colors.border);
  doc.line(sidebarW, contentStartY, sidebarW, pageH);

  // Left Sidebar Content
  let leftY = contentStartY + 12;
  const leftX = 12;
  const leftMaxW = sidebarW - 20;

  const drawSectionTitle = (title: string, x: number, y: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...colors.accent);
    doc.text(title.toUpperCase(), x, y);
  };

  // Education
  drawSectionTitle('Education', leftX, leftY);
  leftY += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.text);
  const degreeLines = doc.splitTextToSize(PROFILE.degree, leftMaxW);
  doc.text(degreeLines, leftX, leftY);
  leftY += degreeLines.length * 4.5 + 1;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.muted);
  const collegeLines = doc.splitTextToSize(PROFILE.college, leftMaxW);
  doc.text(collegeLines, leftX, leftY);
  leftY += collegeLines.length * 4.2 + 6;

  doc.setDrawColor(...colors.border);
  doc.line(leftX, leftY, sidebarW - 8, leftY);
  leftY += 8;

  // Technical Stack
  drawSectionTitle('Technical Stack', leftX, leftY);
  leftY += 6.5;

  SKILL_GROUPS.forEach((group) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...colors.text);
    doc.text(group.category, leftX, leftY);
    leftY += 4.2;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    const items = doc.splitTextToSize(
      group.skills.map((s) => s.name).join(' · '),
      leftMaxW
    );
    doc.text(items, leftX, leftY);
    leftY += items.length * 3.9 + 4.5;
  });

  leftY += 2;
  doc.setDrawColor(...colors.border);
  doc.line(leftX, leftY, sidebarW - 8, leftY);
  leftY += 8;

  // Areas of Interest
  drawSectionTitle('Areas of Interest', leftX, leftY);
  leftY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(...colors.muted);
  const interestLines = doc.splitTextToSize(
    'UI/UX · Web Designing · Programming · AI · Embedded Systems · IoT',
    leftMaxW
  );
  doc.text(interestLines, leftX, leftY);

  // Right Main Column Content
  const rightX = sidebarW + 10;
  const rightMaxW = pageW - rightX - 12;
  let rightY = contentStartY + 12;

  // Profile Summary
  drawSectionTitle('Profile Summary', rightX, rightY);
  rightY += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...colors.text);
  const summaryLines = doc.splitTextToSize(SUMMARY_TEXT, rightMaxW);
  doc.text(summaryLines, rightX, rightY);
  rightY += summaryLines.length * 4.5 + 6;

  doc.setDrawColor(...colors.border);
  doc.line(rightX, rightY, pageW - 12, rightY);
  rightY += 8;

  // Verified GitHub Projects
  drawSectionTitle('Verified GitHub Projects', rightX, rightY);
  rightY += 7;

  FEATURED_PROJECTS.forEach((project, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...colors.text);
    doc.text(project.title, rightX, rightY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(...colors.sky);
    const stackText = project.stack.join(' · ');
    doc.text(stackText, pageW - 12, rightY, { align: 'right' });

    rightY += 4.8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.4);
    doc.setTextColor(...colors.muted);
    const descLines = doc.splitTextToSize(project.summary, rightMaxW);
    doc.text(descLines, rightX, rightY);
    rightY += descLines.length * 4.1 + 1.5;

    // Clickable repo & live URLs
    doc.setFontSize(7.8);
    const repoLinkText = 'GitHub Repository';
    doc.setTextColor(...colors.text);
    doc.textWithLink(repoLinkText, rightX, rightY, { url: project.githubUrl });
    if (project.liveUrl) {
      const repoWidth = doc.getTextWidth(repoLinkText);
      doc.setTextColor(...colors.muted);
      doc.text('  ·  ', rightX + repoWidth, rightY);
      const sepW = doc.getTextWidth('  ·  ');
      doc.setTextColor(...colors.accent);
      doc.textWithLink('Live Deployment', rightX + repoWidth + sepW, rightY, {
        url: project.liveUrl,
      });
    }

    rightY += 5;
    if (idx < FEATURED_PROJECTS.length - 1) {
      doc.setDrawColor(...colors.border);
      doc.line(rightX, rightY, pageW - 12, rightY);
      rightY += 6.5;
    }
  });

  // LinkedIn Certifications section
  rightY += 3;
  doc.setDrawColor(...colors.border);
  doc.line(rightX, rightY, pageW - 12, rightY);
  rightY += 8;

  drawSectionTitle('LinkedIn Certifications', rightX, rightY);
  rightY += 5.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...colors.muted);
  doc.text('View verified certificates and licenses directly on LinkedIn:', rightX, rightY);
  rightY += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.sky);
  doc.textWithLink(PROFILE.linkedinCertsUrl, rightX, rightY, {
    url: PROFILE.linkedinCertsUrl,
  });

  // Quiet bottom signature line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...colors.muted);
  doc.text(
    `Portfolio designed and developed by ${PROFILE.name}  ·  ${PROFILE.location}`,
    rightX,
    pageH - 10
  );

  doc.save('Sivakarthi_Annamalai_Resume.pdf');
}

export function downloadResumeWord(): void {
  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8" />
<title>${PROFILE.name} — Resume</title>
<style>
  body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; color: #111827; margin: 28px 36px; line-height: 1.5; }
  h1 { font-size: 22pt; margin: 0 0 2px; color: #0E1018; }
  .subtitle { font-size: 11pt; color: #5C35B8; font-weight: 600; margin: 0 0 6px; }
  .meta { font-size: 9.5pt; color: #4B5063; margin-bottom: 16px; border-bottom: 2px solid #5C35B8; padding-bottom: 10px; }
  h2 { font-size: 10pt; text-transform: uppercase; letter-spacing: 1.4px; color: #5C35B8; border-bottom: 1px solid #D7D9E2; padding-bottom: 3px; margin: 16px 0 8px; }
  p { font-size: 10pt; margin: 0 0 8px; }
  .item-title { font-weight: 700; font-size: 10.5pt; color: #0E1018; }
  .stack { font-size: 9pt; color: #0E7490; }
  a { color: #5C35B8; text-decoration: none; }
</style>
</head>
<body>
  <h1>${PROFILE.name}</h1>
  <div class="subtitle">${PROFILE.roleLine}</div>
  <div class="meta">
    ${PROFILE.location} | <a href="mailto:${PROFILE.email}">${PROFILE.email}</a><br/>
    GitHub: <a href="${PROFILE.githubUrl}">${PROFILE.githubUrl}</a> | LinkedIn: <a href="${PROFILE.linkedinUrl}">${PROFILE.linkedinUrl}</a>
  </div>

  <h2>Profile Summary</h2>
  <p>${SUMMARY_TEXT}</p>

  <h2>Education</h2>
  <p><span class="item-title">${PROFILE.degree}</span><br/>${PROFILE.college}</p>

  <h2>Technical Stack</h2>
  ${SKILL_GROUPS.map(
    (g) =>
      `<p><span class="item-title">${g.category}:</span> ${g.skills.map((s) => s.name).join(' · ')}</p>`
  ).join('\n  ')}
  <p><span class="item-title">Areas of Interest:</span> UI/UX · Web Designing · Programming · AI · Embedded Systems · IoT</p>

  <h2>Verified GitHub Projects</h2>
  ${FEATURED_PROJECTS.map(
    (p) => `
  <div style="margin-bottom: 10px;">
    <div><span class="item-title">${p.title}</span> <span class="stack">(${p.stack.join(' · ')})</span></div>
    <p>${p.summary}</p>
    <p style="font-size: 9pt;">GitHub: <a href="${p.githubUrl}">${p.githubUrl}</a>${
      p.liveUrl ? ` | Live: <a href="${p.liveUrl}">${p.liveUrl}</a>` : ''
    }</p>
  </div>`
  ).join('\n')}

  <h2>LinkedIn Certifications</h2>
  <p>View verified certificates and licenses directly on LinkedIn: <a href="${PROFILE.linkedinCertsUrl}">${PROFILE.linkedinCertsUrl}</a></p>
</body>
</html>`;

  triggerBlobDownload(
    html,
    'application/msword;charset=utf-8',
    'Sivakarthi_Annamalai_Resume.doc'
  );
}

export function downloadResumeMarkdown(): void {
  const md = `# ${PROFILE.name}
**${PROFILE.roleLine}**

- **Location:** ${PROFILE.location}
- **Email:** ${PROFILE.email}
- **GitHub:** ${PROFILE.githubUrl}
- **LinkedIn:** ${PROFILE.linkedinUrl}

---

## Profile Summary
${SUMMARY_TEXT}

## Education
**${PROFILE.degree}**  
${PROFILE.college}

## Technical Stack
${SKILL_GROUPS.map((g) => `- **${g.category}:** ${g.skills.map((s) => s.name).join(', ')}`).join('\n')}
- **Areas of Interest:** UI/UX, Web Designing, Programming, AI, Embedded Systems, IoT

## Verified GitHub Projects
${FEATURED_PROJECTS.map(
  (p) => `### ${p.title}
- **Stack:** ${p.stack.join(' · ')}
- **Overview:** ${p.summary}
- **Repository:** ${p.githubUrl}${p.liveUrl ? `\n- **Live Deployment:** ${p.liveUrl}` : ''}`
).join('\n\n')}

## LinkedIn Certifications
- Verify certificates directly on LinkedIn: ${PROFILE.linkedinCertsUrl}
`;

  triggerBlobDownload(
    md,
    'text/markdown;charset=utf-8',
    'Sivakarthi_Annamalai_Resume.md'
  );
}

export function downloadResumeText(): void {
  const txt = `${PROFILE.name.toUpperCase()}
${PROFILE.roleLine}
Location: ${PROFILE.location}
Email: ${PROFILE.email}
GitHub: ${PROFILE.githubUrl}
LinkedIn: ${PROFILE.linkedinUrl}

======================================================================
PROFILE SUMMARY
======================================================================
${SUMMARY_TEXT}

======================================================================
EDUCATION
======================================================================
${PROFILE.degree}
${PROFILE.college}

======================================================================
TECHNICAL STACK
======================================================================
${SKILL_GROUPS.map((g) => `${g.category}: ${g.skills.map((s) => s.name).join(' · ')}`).join('\n')}
Areas of Interest: UI/UX · Web Designing · Programming · AI · Embedded Systems · IoT

======================================================================
VERIFIED GITHUB PROJECTS
======================================================================
${FEATURED_PROJECTS.map(
  (p) => `${p.title} [${p.stack.join(', ')}]
${p.summary}
Repository: ${p.githubUrl}${p.liveUrl ? `\nLive: ${p.liveUrl}` : ''}`
).join('\n\n')}

======================================================================
LINKEDIN CERTIFICATIONS
======================================================================
${PROFILE.linkedinCertsUrl}
`;

  triggerBlobDownload(
    txt,
    'text/plain;charset=utf-8',
    'Sivakarthi_Annamalai_Resume.txt'
  );
}

export function downloadResumeJson(): void {
  const payload = {
    basics: {
      name: PROFILE.name,
      label: PROFILE.roleLine,
      email: PROFILE.email,
      location: PROFILE.location,
      summary: SUMMARY_TEXT,
      profiles: [
        { network: 'GitHub', username: PROFILE.githubHandle, url: PROFILE.githubUrl },
        { network: 'LinkedIn', url: PROFILE.linkedinUrl },
      ],
    },
    education: [
      {
        institution: PROFILE.college,
        area: PROFILE.degree,
      },
    ],
    skills: SKILL_GROUPS.map((g) => ({
      category: g.category,
      keywords: g.skills.map((s) => s.name),
    })),
    interests: ['UI/UX', 'Web Designing', 'Programming', 'AI', 'Embedded Systems', 'IoT'],
    projects: FEATURED_PROJECTS.map((p) => ({
      name: p.title,
      category: p.category,
      description: p.summary,
      stack: p.stack,
      githubUrl: p.githubUrl,
      ...(p.liveUrl ? { liveUrl: p.liveUrl } : {}),
    })),
    certificationsUrl: PROFILE.linkedinCertsUrl,
  };

  triggerBlobDownload(
    JSON.stringify(payload, null, 2),
    'application/json;charset=utf-8',
    'Sivakarthi_Annamalai_Resume.json'
  );
}
