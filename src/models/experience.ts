/** Shape of one merged, company-grouped experience entry rendered on the timeline. */
export interface ExperienceContent {
  jobTitle: string;
  previousJobTitles?: string[];
  companyName: string;
  description: string;
  techStack: string[];
  images: string[];
}

/** Timeline entry: `title` is the date range label (e.g. "Mar 2024 – Present"). */
export interface ExperienceTimelineEntry {
  title: string;
  content: ExperienceContent;
}
