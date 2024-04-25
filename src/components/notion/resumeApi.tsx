import React from 'react';
import { StaticImageData } from 'next/image';

import { ExternalLink } from '../../components/ExternalLink';
import { 
  GitHubIcon, 
  LinkedInIcon, 
  XIcon, 
  SubstackIcon, 
  InstagramIcon,
  MediumIcon,
  SpotifyIcon,
  GumroadIcon,
  PatreonIcon,
  PolyworkIcon,
  BuyMeACoffeeIcon,
  BentoIcon,
  ReforgeIcon,
} from "@/components/icons";
// import {
//   AmbitLogo,
//   BarepapersLogo,
//   BimLogo,
//   CDGOLogo,
//   ClevertechLogo,
//   ConsultlyLogo,
//   EvercastLogo,
//   Howdy,
//   JarockiMeLogo,
//   JojoMobileLogo,
//   Minimal,
//   MobileVikingsLogo,
//   MonitoLogo,
//   NSNLogo,
//   ParabolLogo,
//   TastyCloudLogo,
//   YearProgressLogo,
// } from "@/images/logos";
import { 
  Base, 
  Work, 
  Education, 
  Project, 
  Quote, 
  Tool, 
  TypeTool, 
  Life, 
  textLife, 
  arrayLife,
  unknownLife,
} from '../../lib/resumeApi'

const iconMap: { [key: string]: React.ComponentType<any> } = {
  LinkedIn: LinkedInIcon,
  Twitter: XIcon,
  Substack: SubstackIcon,
  Github: GitHubIcon,
  Instagram: InstagramIcon,
  Medium: MediumIcon,
  Spotify: SpotifyIcon,
  Bento: BentoIcon,
  Gumroad: GumroadIcon,
  'Buy Me a Coffee': BuyMeACoffeeIcon,
  Patreon: PatreonIcon,
  Polywork: PolyworkIcon,
  Reforge: ReforgeIcon,
  // Beehiiv: ,
  // Topmate: ,
};

// TO-DO: CAN WE FETCH THESE FROM NOTION VIA resumeApi.ts?
const logoMap: { [key: string]: string | StaticImageData } = {
  // 'IIT Kanpur': IITKLogo,
  // 'Jenn.AI': "",
  // 'Decision Point Analytics': DecisionPointLogo,
  // 'Shiprocket': ShiprocketLogo,
  // 'Clear(Tax)': CleartaxLogo,
  // 'Cogoport': CogoportLogo,
  // 'Personal Website': WebsiteLogo,
  // 'Personal Blog': SubstackBlogLogo,
  // 'Sodoku Solver': "",
};

export function filterItem(item: any, filterKey: string, filterValue?: string): boolean {
  return (
    (filterValue ? item[filterKey]?.includes(filterValue) : true)
    || (item[filterKey]?.includes("all"))
  ); // Include all if filterValue is undefined or item[filterKey] includes "all"
};

export function filterLifeApi(data: Life, filterKey: string, filterValue?: string) {
    function isNonStringArray(data: unknown): data is unknown[] {
    return Array.isArray(data) && !data.every(item => typeof item === 'string');
  }

  for (const cat in data) {
    if (data[cat] && isNonStringArray(data[cat])) {
      // console.log(cat);
      data[cat] = (data[cat] as any[]).filter(item => filterItem(item, filterKey, filterValue));
    }
  }

  return data;
};

export function transformLifeApi(data: Life, category: string[]) {
  for (const cat of category) {
    // console.log(cat);
    if (data[cat] 
      // && (typeof data[category as keyof Life] !== "undefined") 
      // && Array.isArray(data[category as keyof Life])
      ) {
      // console.log(1);
      if (cat === "text") {
        // For category = 'text', key = 'name' or 'refPage' AND value = ['value' OR/AND 'link']
        // For category = 'array', key = 'name' or 'refPage' AND value = ['tags']
        // console.log(transformLifeApiData(data.text || [],"text","name",["value","link"]));
        // console.log(transformLifeApiData(data[category] as Base[],category,key,value));
        (data.transformedText as unknownLife) = transformLifeApiData(data[cat] as Base[],"text",'name',["value","link"]) as unknownLife;
      } else if (cat === "array") {
        (data.transformedArray as unknownLife) = transformLifeApiData(data[cat] as Base[],"array",'name',["tags"]) as unknownLife;
      } else if (cat === "socialMedia") {
        // console.log(1);
        // console.log(parseSocialMediaData(data[cat] as Base[]));
        if (data.transformedArray) {
          // console.log(2);
          // console.log(data.transformedArray.publicHomepageSocialLinks);
          // data[cat] = parseSocialMediaData(data[cat] as Base[],data.transformedArray?.publicHomepageSocialLinks as string[]);
        } else {
          data[cat] = parseSocialMediaData(data[cat] as Base[]);
        }
      }
    } else {
      throw new Error(`data[${cat}] is undefined or empty`);   
    }
  }

  return data;
};

type transformType = unknownLife;  
// export function transformLifeApiData(data: Base[], category: string, key: string, value: string[]): Record<string, string | string[] | JSX.Element> {
export function transformLifeApiData(data: Base[], category: string, key: string, value: string[], refPage?: string): transformType {
  // Functionality:
  // Convert an array of dict into a dict using a function which takes following inputs:
  //  1. array:Base[] (A) where Base = {name?: string; value?: string; link?: string; tags?: string[]; createdTime?: string; sequence?: number;};
  //  2. category:string ("Text" or "Array")
  //  3. key:string ("name" or "link")
  //  4. value:string[] ("value", "link" or "tags")
  //  Condition 1 - If category is "Array", then key could be "name" or "link" and value could only be ["tags"]
  //  Condition 1 - If category is "Text", then key could only be "name" & value could be ["value"] or ["link"]
  //  Logic 1: If (category is "Text", key is "name" and value is ["value"]) OR (category is "Array" & key is "name") THEN for each item in A -> result[A[item][key].replace(/\s+/g, '').replace(/\w+/g, (word: string) => word[0].toLowerCase() + word.slice(1))] = A[value]
  //  Logic 2: If (category is "Text", key is "name" and value is ["link"]) THEN for each item in A -> result[A[item][key].replace(/\s+/g, '').replace(/\w+/g, (word: string) => word[0].toLowerCase() + word.slice(1))] = `<a href="${A[value]}"></a>`
  //  Logic 3: If category is "Array" & key is "link" then for each item in A -> result[link][A[item][key].replace(/\s+/g, '').replace(/\w+/g, (word: string) => word[0].toLowerCase() + word.slice(1))] = A[value]

  if (!(category === "text" || category === "array")) {
    throw new Error(`data[${category}] is not allowed for any transformation`);
  }
  if (!data) {
    throw new Error("data is undefined or empty");
  }
  
  // const result: { [key: string]: {} | { [key: string]: {} } } = {};
  // const result: Record<string, string | string[]> = {};
  const result: transformType = {} as unknownLife;

  for (const item of data) {
    if (category === "text") {
      const modifiedKey = item.name?.replace(/\s+/g, "").replace(/\w+/g, (word: string) => word[0].toLowerCase() + word.slice(1));
      if (
        (key === "name" || key === "refPage") 
        && (value.includes("value") || value.includes("link"))
        && value.length < 3
        && modifiedKey
        ) {
        if (key == "name") {
          if (value.includes("value") && value.includes("link") && value.length === 2) {
            // console.log(modifiedKey,category,1);
            result[modifiedKey as keyof transformType] = item.link ? `<a href="${item.link || ""}"></a>` : item.value || "";
          } else if (value.includes("value") && value.length === 1) {
            // console.log(modifiedKey,category,2);
            result[modifiedKey as keyof transformType] = item.value || "";
          } else if (value.includes("link") && value.length === 1) {
            // console.log(modifiedKey,category,3);
            result[modifiedKey as keyof transformType] = `<a href="${item.link || ""}"></a>`;
          }
        } else if (key == "refPage") {
          const linkKeys = item.refPage?.length ? item.refPage : ["unknown"];
          // console.log(modifiedKey,item.refPage,linkKeys);
          linkKeys?.forEach((page) => {
            // console.log(page);
            if (refPage) {
              if (page == refPage) {
                if (value.includes("value") && value.includes("link") && value.length === 2) {
                  // console.log(modifiedKey,category,1);
                  result[modifiedKey as keyof transformType] = item.link ? `<a href="${item.link || ""}"></a>` : item.value || "";
                } else if (value.includes("value") && value.length === 1) {
                  // console.log(modifiedKey,category,2);
                  result[modifiedKey as keyof transformType] = item.value || "";
                } else if (value.includes("link") && value.length === 1) {
                  // console.log(modifiedKey,category,3);
                  result[modifiedKey as keyof transformType] = `<a href="${item.link || ""}"></a>`;
                }
              }
            } else {
              throw new Error(`refPage is missing`)
            }
          });
        }
      } else {
        throw new Error("Only key:value pairs of 'name':['value' or/and 'link'] or 'refPage':['value' or/and 'link'] are acceptable when category = 'text'");
      }
    } else if (category === "array") {
      const modifiedKey = item.name?.replace(/\s+/g, "").replace(/\w+/g, (word: string) => word[0].toLowerCase() + word.slice(1));
      if (value.includes("tags") && value.length === 1 && (key === "name" || key === "refPage") && modifiedKey) {
        if (key === "name") {
          // console.log(modifiedKey,category,1);
          result[modifiedKey] = item.tags || [];
        } else if (key === "refPage") {
          const linkKeys = item.refPage?.length ? item.refPage : ["unknown"];
          // console.log(modifiedKey,item.refPage,linkKeys);
          linkKeys?.forEach((page) => {
            // console.log(page);
            if (refPage) {
              if (page == refPage) {
                // console.log(modifiedKey,category,2);
                result[modifiedKey as keyof transformType] = item.tags || [];
                }
            } else {
              throw new Error(`refPage is missing`)
            }
          });
        }
      } else {
        throw new Error("Only value = ['tags'] & key = 'name' or 'refPage' is acceptable when category = 'array'");
      }
    }
  }

  return result;
};

type SocialMediaData = Base;
export interface ParsedSocialMediaData extends SocialMediaData {
    icon?: React.ComponentType<any>;
};

export const parseSocialMediaData = (
  socialMediaData: SocialMediaData[],
  filterNames?: string[]
): ParsedSocialMediaData[] => {
  const allNames = socialMediaData.map(item => item.name).filter(Boolean);  // Extract unique names (excluding falsy values)
  // console.log(allNames);
  const namesToFilter = filterNames || allNames;  // Set default array if undefined

  return socialMediaData.map(item => {
    const parsedItem: ParsedSocialMediaData = { ...item };  // Create a base parsed object

    if (item.name && iconMap[item.name]) {
      parsedItem.icon = iconMap[item.name];
    }

    return parsedItem;
  }).filter(item => namesToFilter.includes(item.name));
};

type WorkData = Work;
export interface ParsedWorkData extends WorkData {
    logo: string | StaticImageData;
};

export const parseWorkData = (
  workData: WorkData[],
  filterWork?: string[]
): ParsedWorkData[] => {
  const allWork = workData.map(item => item.company).filter(Boolean);  // Extract unique names (excluding falsy values)
  const workToFilter = filterWork || allWork; // Set default array if undefined
  // console.log(workToFilter);
  
  return workData.map(item => {
    if (item.company && logoMap[item.company]) {
      return {
        ...item,
        logo: logoMap[item.company],
      };
    } else {
      // Handle the case when item.name is undefined or iconMap[item.name] is undefined
      return {
        ...item,
        logo: "", // Use empty string or some default value
      };
    }
  }).filter(item => workToFilter.includes(item.company));
};

type EducationData = Education;
export interface ParsedEducationData extends EducationData {
    logo: string | StaticImageData;
};

export const parseEducationData = (
  educationData: EducationData[],
  filterEducation?: string[]
): ParsedEducationData[] => {
  const allEducation = educationData.map(item => item.school).filter(Boolean);  // Extract unique names (excluding falsy values)
  const educationToFilter = filterEducation || allEducation; // Set default array if undefined
  // console.log(educationToFilter);
  
  return educationData.map(item => {
    if (item.school && logoMap[item.school]) {
      return {
        ...item,
        logo: logoMap[item.school],
      };
    } else {
      // Handle the case when item.name is undefined or iconMap[item.name] is undefined
      return {
        ...item,
        logo: "", // Use empty string or some default value
      };
    }
  }).filter(item => educationToFilter.includes(item.school));
};

type ProjectsData = Project;
export interface ParsedProjectsData extends ProjectsData {
    logo: string | StaticImageData;
};

export const parseProjectsData = (
  projectsData: ProjectsData[],
  filterProject?: string[]
): ParsedProjectsData[] => {
  const allProject = projectsData.map(item => item.title).filter(Boolean);  // Extract unique names (excluding falsy values)
  const projectToFilter = filterProject || allProject; // Set default array if undefined
  // console.log(projectToFilter);
  
  return projectsData.map(item => {
    if (item.title && logoMap[item.title]) {
      return {
        ...item,
        logo: logoMap[item.title],
      };
    } else {
      // Handle the case when item.name is undefined or iconMap[item.name] is undefined
      return {
        ...item,
        logo: "", // Use empty string or some default value
      };
    }
  }).filter(item => projectToFilter.includes(item.title));
};

type QuotesData = Base;
export type ParsedQuotesData = Quote;

export const parseQuoteData = (quotesData: QuotesData[]): ParsedQuotesData[] => {
  const quotesArray: ParsedQuotesData[] = [];

  // console.log(quotesData);
  quotesData.forEach((item) => {
    // console.log(item);
    if (item.value) {
      const quotes = item.value.split(';\n').map((quote) => quote.trim());
      // console.log(quotes);
      quotes.forEach((quote) => {
        quotesArray.push({
          content: quote.replace(/[\u201C\u201D]/g, ''),
          author: '- ' + item.name,
        });
      });
    }
  });

  return quotesArray;
};

type ToolsData = Project;
export type ParsedToolsData = {
  [key: string]: string[];
};;

export const parseToolData = (toolsData: ToolsData[], camelCase: boolean = true): ParsedToolsData => {
  const toolsDict: ParsedToolsData = {} as ParsedToolsData;

  toolsData.forEach((item) => {
    // console.log(item);
    if (item.title) {
      item.techStack?.forEach((tag) => {
        // console.log(tag);
        const modifiedTag = camelCase
          ? tag.replace(/\s+/g, "").replace(/\w+/g, (word: string) => word[0].toLowerCase() + word.slice(1))
          : tag;

        if (!toolsDict[modifiedTag]) {
          (toolsDict[modifiedTag] as string[]) = [] as string[];
        }

        (toolsDict[modifiedTag]).push(item.title || '');
      });
    }
  });

  return toolsDict;
};

export function parseText(input: string, link = true): React.ReactElement {
  // console.log(input);

  const regex = /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1(?:[^>]*?>)(.*?)<\/a>/g;
  const parts = input.split(regex);
  // console.log(parts);
  const elements: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    // console.log(part, index);
    if (index % 4 === 0) {
      if (part.includes('\n')) {
        // Split the part by newline and create separate elements
        const lines = part.split('\n');
        // console.log('--',lines);
        lines.forEach((line, lineIndex) => {
          // console.log('------',line, lineIndex);
          elements.push(<span key={`${index}-${lineIndex}`}>{line}</span>);
          if (lineIndex < lines.length - 1) {
            elements.push(<br></br>);
          }
        });
      } else {
        elements.push(part);
      }
    } else if (index % 4 === 1) {
      elements.push(
        link ? (
          <ExternalLink key={index} href={parts[index + 1]}>
            {parts[index + 2]}
          </ExternalLink>
        ) : (
          parts[index + 2]
        )
      );
    }
  });
  // console.log(elements);

  return (
    <>
      {link && <React.Fragment>{elements}</React.Fragment>}
      {!link && elements}
    </>
  );
};

export type ParsedHyperlinkedText = {
  text?: string;
  link?: string;
};

export function parseHyperlinkedText(input: string): ParsedHyperlinkedText[] {
  // console.log(input);
  const regex = /<a href="(.*?)">(.*?)<\/a>/g;
  const parsedElements: ParsedHyperlinkedText[] = [];
  
  let match;
  while ((match = regex.exec(input)) !== null) {
    // Destructure captured groups: link (group 1) and text (group 2)
    const [_, link, text] = match;
    
    // Add parsed element to the array
    parsedElements.push({ text, link });
  };

  const remainingText = input.replace(regex, "");
  if (remainingText) {
    parsedElements.push({ text: remainingText });
  };
  // console.log(parsedElements);

  return parsedElements;
};

export function onlyText(input: string): string {
  const regex = /<a href="(.*?)">(.*?)<\/a>/g;
  const parts = input.split(regex);
  // console.log(parts);
  const parsedElements: string[] = [];
  
  parts.forEach((part, index) => {
    // parsing logic which removes the part which resembles a website URL
    const regex1 = /^(http|https):\/\/\S+/;
    if (!regex1.test(part)) {
      parsedElements.push(part);
    }
  });
  // console.log(parsedElements);

  const onlyText = parsedElements.join('');
  // console.log(onlyText);

  return onlyText;
};

export function parseArray(input: string): string[] {
  // console.log(input);
  const parsedArray: string[] = [];

  const splitData = input.split(';\n').map((item) => item.trim());
  // console.log(splitData);
  splitData.forEach((item) => {
    parsedArray.push(item.replace(/[\u201C\u201D]/g, ''));
  });

  return parsedArray;
};

