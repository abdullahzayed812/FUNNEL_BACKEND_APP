export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  password: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface UserRole {
  userId: string;
  roleId: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
}

export interface Persona {
  id: string;
  name: string;
  ageGroup: string;
  gender: string;
  interests: string;
  location: string;
}

export interface CampaignPersonas {
  campaignId: string;
  personaId: string;
}

export interface Ad {
  id: string;
  campaignId: string;
  personaId: string;
  content: string;
  budget: number;
  duration: number;
  startDate: string;
  endDate: string;
}

export interface TemplateText {
  text: string;
  translateX: number;
  translateY: number;
  fontSize: string | number;
  fontFamily: string | undefined;
  fontWeight: "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | undefined;
  textDecorationLine: "none" | "underline" | "line-through" | "line-through" | undefined;
  fontStyle: "normal" | "italic" | undefined;
  borderRadius: number | undefined;
  borderWidth: number | undefined;
  borderStyle: "solid" | "dashed" | "dotted" | undefined;
  borderColor: string;
  containerColor: string;
  color: string;
  language?: string;
}

export interface Template {
  id: number | string;
  name: string;
  frameSvg: string;
  defaultPrimary: string;
  defaultSecondary: string;
  headline: TemplateText;
  punchline: TemplateText;
  cta: TemplateText;
  isSelected?: boolean;
}

export interface Image {
  id: string;
  filePath: string;
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  website: string;
}
