import { Client, isFullPage } from '@notionhq/client';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { compareAsc, compareDesc } from 'date-fns';
import { getPlaiceholder, GetPlaiceholderReturn  } from 'plaiceholder';

interface Page {
	created_time: string;
  properties: PageProperties;
  icon: { [key: string]: any } | null;
};

interface PageProperties {
  key: { title: { plain_text: string }[] };
  appliedPage: { multi_select: Category[] };
  category: { multi_select: Category[] };
  value: { rich_text: TextSegment[] };
  link: { url: string | null, id: string, type: string };
  keyOrder: { number: number };
  tags: { multi_select: Category[] };
  title: { rich_text: TextSegment[] };
  start: { rich_text: TextSegment[] };
  end: { rich_text: TextSegment[] };
  created_time: { created_time: any };
};

interface TextSegment {
  plain_text: string;
  href?: string | null;
};

interface Category {
	name: string;
	color?: string;
};

// Combine separate types to create the final Life type
export type Life = baseLife & projectLife & workLife & educationLife & textLife & arrayLife;

// Define separate types for different lists in Life
export type baseLife = {
	// [key: string]: Base[] | undefined;
	text?: Base[];
	array?: Base[];
  socialMedia?: Base[];
  books?: Base[];
  videosWorthWatching?: Base[];
  podcasts?: Base[];
  blogs?: Base[];
  peopleWorthFollowingOnTwitter?: Base[];
  quotes?: Base[];
};

export type Base = {
	name?: string;
	value?: string;
	link?: string;
	refPage?: string[];
	tags?: string[];
	createdTime?: string;
	keyOrder?: number;
	icon?: React.ComponentType<any>;
};

export type projectLife = {
  myCurrentProjects?: Project[];
  myPastProjects?: Project[];
  artifacts?: Project[];
  tools?: Project[];
  skills?: Project[];
};

export type Project = {
  title?: string;
  link?: string;
	refPage?: string[];
  techStack?: string[];
  description?: string;
	createdTime?: string;
	keyOrder?: number;
	tags?: string[];
	icon?: React.ComponentType<any>;
};

export type workLife = {
  work?: Work[];
};

export type Work = {
	company?: string;
  link?: string;
	refPage?: string[];
  badges?: string[];
  title?: string;
  start?: string;
  end?: string;
  description?: string;
	createdTime?: string;
	keyOrder?: number;
	icon?: React.ComponentType<any>;
};

export type educationLife = {
  education?: Education[];
};

export type Education = {
	school?: string;
  link?: string;
	refPage?: string[];
  badges?: string[];
  degree?: string;
  start?: string;
  end?: string;
  description?: string;
	createdTime?: string;
	keyOrder?: number;
	icon?: React.ComponentType<any>;
};

export type textLife = {
	[key: string]: unknown;
	transformedText?: unknownLife;
};

export type arrayLife = {
	[key: string]: unknown;
	transformedArray?: unknownLife;
};

export type unknownLife = {
	[key: string]: unknown;
};

// export type stringLife = {
//   name?: string;
//   initials?: string;
//   currentLocation?: string;
//   about?: string;
//   aboutExtended?: string;
//   homePageTitle?: string;
//   resumeSummary?: string;
//   publicEmail?: string;
//   publicPhoneNumber?: string;
//   avatarURL?: string;
//   personalWebsiteURL?: string;
//   publicCVURL?: string;
//   detailedCVURL?: string;
// };

// export type listLife = {
// 	publicWorkSummary?: string[];
// 	publicHomepageSocialLinks?: string[];
// 	publicAboutpageSocialLinks?: string[];
//   publicResumeSocialLinks?: string[];
//   publicResumeWork?: string[];
//   publicResumeEducation?: string[];
//   publicArtifacts?: string[];
//   publicResumeArtifacts?: string[];
//   publicProjects?: string[];
//   publicResumeProjects?: string[];
// };

export type Quote = {
	content?: string;
	author?: string;
};

export type Tool = {
	name?: string;
	link?: string;
	description?: string;
};

export type TypeTool = {
	[key: string]: unknownLife[];
	// tag?: unknownLife[];
};

const CompareFunctionLookup = {
  asc: compareAsc,
  desc: compareDesc,
};

export class ResumeApi {
	constructor(
		private readonly notion: Client,
		private readonly databaseId: string,
	) {}

	async getData(sortOrder: 'asc' | 'desc' = 'asc', limit?: number): Promise<Life> {
		const lifedb = await this.getDatabaseContent(this.databaseId, sortOrder, limit);    
		// console.log(lifedb[0]);

		const lifedata: Life = {};
    for (const page of lifedb) {
      const { key, value, link, appliedPage, category, created_time, keyOrder, tags, title, start, end } = page.properties;
      const icon = page.icon;
      // console.log(icon);

      let lifeKey = '';
      
      for (const item of category.multi_select) {
      	// console.log(item.name,key.title[0].plain_text);

      	// Convert key for consistency with Life object properties
	      const lifeKey = item.name
	        .replace(/\s+/g, '') // Remove any spaces
	        .replace(/\w+/g, (word: string) => word[0].toLowerCase() + word.slice(1)); // Camel case to lowercase-and-uppercase

        // if (item.name === 'Text') {
        // 	// Convert key for consistency with Life object properties
		    //   const lifeKey = key.title[0].plain_text
		    //     .replace(/\s+/g, '') // Remove any spaces
		    //     .replace(/\w+/g, (word: string) => word[0].toLowerCase() + word.slice(1)); // Camel case to lowercase-and-uppercase
			
				// 	// console.log(key, category, lifeKey);

		    //   // Assign value to Life object property using value property of lifedb's pages
		    //   lifedata[lifeKey as keyof stringLife] = link.url
		    //     ? `<a href="${link.url}">${value.rich_text.map((textSegment: TextSegment) => textSegment.plain_text).join('')}</a>`
		    //     : value.rich_text.map((textSegment: TextSegment) => {
		    //         // Use rich_text[n].href for all text segments (including those without links)
		    //         const segmentHref = textSegment.href
		    //         return segmentHref ? `<a href="${segmentHref}">${textSegment.plain_text}</a>` : textSegment.plain_text;
		    //       }).join('');
				// }
				// if (item.name == 'Array') {
				// 	// Convert key for consistency with Life object properties
		    //   const lifeKey = key.title[0].plain_text
		    //     .replace(/\s+/g, '') // Remove any spaces
		    //     .replace(/\w+/g, (word: string) => word[0].toLowerCase() + word.slice(1)); // Camel case to lowercase-and-uppercase
			
				// 	// console.log(key, category, lifeKey);

	      //   // Assign value to Life object property using value property of lifedb's pages
		    //   lifedata[lifeKey as keyof listLife] = tags?.multi_select ? tags.multi_select.map((tag: Category) => tag.name) : [];
				// }
        if (['Text','Social Media','Books','Videos Worth Watching','Podcasts','Blogs','People Worth Following On Twitter','Companies Links','Quotes','Array'].includes(item.name)) {
          // console.log(key, category, lifeKey);
          // if (item.name === 'Array') {
          // 	console.log(key, category, lifeKey);
          // }
					
					// Convert lifeKey if needed
					
		      // Assign value to Life object property using value property of lifedb's pages
		      if (!lifedata[lifeKey as keyof baseLife]) {
            lifedata[lifeKey as keyof baseLife] = [];
          }

          (lifedata[lifeKey as keyof baseLife] as Base[]).push({
            name: key.title[0].plain_text,
            value: value.rich_text.map((textSegment: TextSegment) => {
		            // Use rich_text[n].href for all text segments (including those without links)
		            const segmentHref = textSegment.href
		            return segmentHref ? `<a href="${segmentHref}">${textSegment.plain_text}</a>` : textSegment.plain_text;
		          }).join(''),
            link: link.url ? link.url : "",
            refPage: appliedPage?.multi_select ? appliedPage.multi_select.map((tag: Category) => tag.name) : [],
            tags: tags?.multi_select ? tags.multi_select.map((tag: Category) => tag.name) : [],
            createdTime: created_time.created_time,
            keyOrder: keyOrder.number,
          });
				}
				else if (['Work','Education','My Current Projects','My Past Projects','Artifacts','Tools','Skills'].includes(item.name)) {
					const titlePlainText = title.rich_text[0]?.plain_text;
					const startPlainText = start.rich_text[0]?.plain_text;
					const endPlainText = end.rich_text[0]?.plain_text;
					const valuePlainText = value.rich_text.map((textSegment: TextSegment) => {
	            // Use rich_text[n].href for all text segments (including those without links)
	            const segmentHref = textSegment.href
	            return segmentHref ? `<a href="${segmentHref}">${textSegment.plain_text}</a>` : textSegment.plain_text;
	          }).join('');
					
					// Convert lifeKey if needed
					
          if (item.name === 'Work') {
          	// console.log(page);
	          const workItem: Partial<Work> = {
						  company: key.title[0].plain_text,
						  link: link.url ? link.url : "",
            	refPage: appliedPage?.multi_select ? appliedPage.multi_select.map((tag: Category) => tag.name) : [],
						  badges: tags?.multi_select ? tags.multi_select.map((tag: Category) => tag.name) : [''],
						  createdTime: created_time.created_time,
						  keyOrder: keyOrder.number,
						};

						if (titlePlainText) workItem.title = titlePlainText;
						if (startPlainText) workItem.start = startPlainText;
						if (endPlainText) workItem.end = endPlainText;
						if (valuePlainText) workItem.description = valuePlainText;
						// console.log(workItem);
						// console.log(this.convertIconToLogo(icon));
						// if (icon) workItem.logo = this.convertIconToLogo(icon);

						if (!lifedata[lifeKey as keyof workLife]) {
	            lifedata[lifeKey as keyof workLife] = [];
	          }

						(lifedata[lifeKey as keyof workLife] as Work[]).push(workItem as Work);
					};

					if (item.name === 'Education') {
	          const workItem: Partial<Education> = {
						  school: key.title[0].plain_text,
						  link: link.url ? link.url : "",
            	refPage: appliedPage?.multi_select ? appliedPage.multi_select.map((tag: Category) => tag.name) : [],
						  badges: tags?.multi_select ? tags.multi_select.map((tag: Category) => tag.name) : [''],
						  createdTime: created_time.created_time,
						  keyOrder: keyOrder.number,
						};
						
						if (titlePlainText) workItem.degree = titlePlainText;
						if (startPlainText) workItem.start = startPlainText;
						if (endPlainText) workItem.end = endPlainText;
						if (valuePlainText) workItem.description = valuePlainText;

						if (!lifedata[lifeKey as keyof educationLife]) {
	            lifedata[lifeKey as keyof educationLife] = [];
	          }

						(lifedata[lifeKey as keyof educationLife] as Education[]).push(workItem as Education);
					};

					if (['My Current Projects','My Past Projects','Artifacts','Tools','Skills'].includes(item.name)) {
	          const workItem: Partial<Project> = {
						  title: key.title[0].plain_text,
						  link: link.url ? link.url : "",
            	refPage: appliedPage?.multi_select ? appliedPage.multi_select.map((tag: Category) => tag.name) : [],
						  techStack: tags?.multi_select ? tags.multi_select.map((tag: Category) => tag.name) : [''],
						  tags: tags?.multi_select ? tags.multi_select.map((tag: Category) => this.convertToKebabCase(tag.name)) : [''],
						  createdTime: created_time.created_time,
						  keyOrder: keyOrder.number,
						};
						
						if (valuePlainText) workItem.description = valuePlainText;

						if (!lifedata[lifeKey as keyof projectLife]) {
	            lifedata[lifeKey as keyof projectLife] = [];
	          }

						(lifedata[lifeKey as keyof projectLife] as Project[]).push(workItem as Project);
					};
				}
			}
    };

		// const property = 'work';
		// // console.log(lifedata[property]);
		// for (const item in lifedata[property]) {
		// 	// console.log(lifedata[property][item]);
		// 	console.log(lifedata[property][item].company, 
		// 		lifedata[property][item].createdTime, 
		// 		lifedata[property][item].keyOrder);
		// };

		// Sort each group by keyOrder
		for (const category in lifedata) {
			const categoryData = lifedata[category as keyof Life];
			if (categoryData 
					&& Array.isArray(categoryData)
					&& categoryData.every(item => (Object.prototype.hasOwnProperty.call(item, 'keyOrder') && typeof item !== 'string' && item.keyOrder !== null))
					) {
				let sortOrderForCategory = sortOrder; // Default sortOrder

		    // Reverse the sortOrder for select categories like "work", "education", "artifacts", etc.
		    // if (["work","education","myCurrentProjects","myPastProjects","artifacts"].includes(category)) {
		    //   sortOrderForCategory = "desc"; // Change sortOrder to "desc"
		    // }
				
				// console.log(category, typeof categoryData, categoryData.every(item => Object.prototype.hasOwnProperty.call(item, 'keyOrder')));    
		    categoryData.sort((a, b) => {
	        // return CompareFunctionLookup[sortOrderForCategory](Number(a.keyOrder), Number(b.keyOrder));
		    	// Check if a and b are objects with keyOrder property
				  if (typeof a === 'object' && 'keyOrder' in a && a.keyOrder !== null && 
				  		typeof b === 'object' && 'keyOrder' in b && b.keyOrder !== null) {
				    return CompareFunctionLookup[sortOrderForCategory](Number(a.keyOrder), Number(b.keyOrder));
				  } else {
				    // Handle cases where a or b is not an object with keyOrder
				    console.warn('Invalid element in categoryData, skipping sort');
				    return 0;  // Or return another default value
				  }
		    });

		    // Reassign sorted categoryData back to lifedata
        lifedata[category as keyof Life] = categoryData as (string & Base[] & Work[] & Education[] & Project[] & string[]) | undefined;
		  }
		}

		// for (const item in lifedata[property]) {
		// 	// console.log(lifedata[property][item]);
		// 	console.log(lifedata[property][item].company, 
		// 		lifedata[property][item].createdTime, 
		// 		lifedata[property][item].keyOrder);
		// };

		return lifedata;
	};

	async getProjectsByTag(tag: string, sortOrder: 'asc' | 'desc' = 'desc', limit?: number) {
    const lifeData = await resumeApi.getData(sortOrder, limit);
    // console.log(lifedata);
    
    // Create filtered Life data
	  const filteredLifeData: Life = {};

	  if (lifeData) {
		  for (const key in lifeData) {
		  	if (lifeData[key as keyof Life]) {
			    if (Array.isArray(lifeData[key as keyof Life])) {
			    	// console.log(lifeData[key]);
			    	const filteredProjects = (lifeData?.[key as keyof projectLife] as Life[keyof projectLife])?.filter(item => item && item.tags?.includes(tag)) ?? [];
			      if (filteredProjects && filteredProjects.length > 0) { // Check for non-empty array before adding
			        filteredLifeData[key as keyof projectLife] = filteredProjects;
			      }
			    } else if (key === 'initials') {
			      // filteredLifeData[key as keyof stringLife] = lifeData[key];
		    	}
		    }
		  }
		}
	  // console.log(filteredLifeData);

  	return filteredLifeData;
  };

	async getAllTags() {
    const lifedb = await this.getDatabaseContent(this.databaseId);
    // console.log(lifedb);

    const allTags: string[] = [];
    for (const page of lifedb) {
    	const { tags } = page.properties;
    	// console.log(tags);
    	const mappedTags = tags?.multi_select?.map((tag: Category) => this.convertToKebabCase(tag.name));
		  if (mappedTags && mappedTags.length > 0) {
		    allTags.push(...mappedTags);
		  }
    	// allTags.push(
    	// 	tags?.multi_select 
    	// 		? tags.multi_select.map((tag: Category) => this.convertToKebabCase(tag.name)) 
    	// 		: '');
    };
    // console.log(allTags);
    // console.log(Array.from(new Set(allTags.map((tags) => tags).flat())));

    return Array.from(new Set(allTags.map((tags) => tags).flat()));
  };

  // Function to convert tag names to kebab-case
	convertToKebabCase(tag: string): string {
	  return tag.toLowerCase().replace(/\s+/g, '-');
	};

	async convertIconToLogo(icon: any): Promise<any> {
	  // console.log(icon);
	  try {
	    // Extract URL from the icon object
	    const contents = icon[icon.type];
	    // console.log(contents);
	    const url = contents.url;
	    // console.log(url);

	    // Fetch the image from the URL
	    const buffer = await fetch(url).then(async (res) =>
      	Buffer.from(await res.arrayBuffer()),
    	);
			// console.log(buffer);
	    
	    // const response = await fetch(url);
	    // console.log(response);
	    // const buffer = await response.arrayBuffer();
			// console.log(buffer);
	    
	    // Generate base64-encoded placeholder image using Plaiceholder
	    // const {
	    //   base64,
	    //   metadata: { height, width },
	    // } = await getPlaiceholder(buffer, { size: 64 });
	    const { base64, metadata }: GetPlaiceholderReturn = await getPlaiceholder(buffer, { size: 64 });
	    // console.log(metadata);

	    // Create the logo object
	    const logo = {
	      src: url, // Replace with the path where you want to store the image
	      height: metadata.height,
	      width: metadata.width,
	      blurDataURL: base64,
	      blurWidth: metadata.width,
	      blurHeight: metadata.height
	    };

	    // console.log(logo);

	    return logo;
	  } catch (error) {
	    console.error('Error converting icon to logo:', error);
	    return null;
	  }
	};

	private mapToPage(result: any): Page | null {
    if (result.object === 'page' || result.object === 'database') {
        return { 
        	created_time: result.created_time,
        	properties: result.properties,
        	icon: result.icon
        };
    }
    return null;
	};

	private async getDatabaseContent(databaseId: string, sortOrder: 'asc' | 'desc' = 'desc', limit?: number): Promise<Page[]> {
    const db = await this.notion.databases.query({ database_id: databaseId });

    while (db.has_more && db.next_cursor) {
      const { results, has_more, next_cursor } = await this.notion.databases.query({
        database_id: databaseId,
        start_cursor: db.next_cursor,
      });
      db.results = [...db.results, ...results];
      db.has_more = has_more;
      db.next_cursor = next_cursor;
    }

    const db_properties = await this.notion.databases.retrieve({ database_id: databaseId });
    // console.log(db_properties);

    // console.log(db.results);
    return db.results
    	.filter((result): result is PageObjectResponse => 'created_time' in result)
      .sort((a, b) => {
        return CompareFunctionLookup[sortOrder](new Date(a.created_time), new Date(b.created_time));
      })
      .map(this.mapToPage).filter((result): result is Page => result !== null)
      .slice(0, limit);
  };
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// console.log(process.env.NOTION_RESUME_DATABASE_ID);
export const resumeApi = new ResumeApi(notion, process.env.NOTION_RESUME_DATABASE_ID!);
