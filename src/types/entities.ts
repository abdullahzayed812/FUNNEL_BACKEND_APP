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
  id: string;
  type: string;
  text: string;
  xCoordinate: number;
  yCoordinate: number;
  templateId: string;
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
  textColorBrandingType: "primary" | "secondary" | "additional" | null;
  containerColorBrandingType: "primary" | "secondary" | "additional" | null;
  color: string;
  language?: string;
}

export interface Template {
  id: string;
  name: string;
  tag: string;
  type: string;
  frameSvg: string;
  defaultPrimary: string;
  defaultSecondary: string;
  templateTexts: {
    [index: string]: TemplateText;
  };
  isSelected?: boolean;
}

export interface Image {
  id: string;
  filePath: string;
  imageType: string;
}

export interface Video {
  id: string;
  filePath: string;
  imageType: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  website: string;
  type: "Default" | "Customized";
}

export interface Branding {
  id: string;
  type: string;
  primaryColor: string;
  secondaryColor: string;
  additionalColor: string;
  primaryFont: string;
  secondaryFont: string;
}

export interface GeneratedVisuals {
  id: string;
  template: Template;
  image: Image;
}

export type TemplateTextType = "headline" | "punchline" | "cta";
