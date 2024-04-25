import { Metadata } from "next";
import { GlobeIcon, MailIcon, PhoneIcon } from "lucide-react";
import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommandMenu } from "@/components/command-menu";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { ArrowDownIcon } from "../components/icons/ArrowDownIcon";

import { RESUME_DATA } from "@/data/resume-data";
import { Life, resumeApi } from '../lib/resumeApi';
import {
  filterLifeApi,
  transformLifeApi,
  transformLifeApiData,
  parseWorkData,
  parseEducationData,
  parseProjectsData,
  parseToolData,
  parseSocialMediaData,
  parseText,
  onlyText,
  parseHyperlinkedText,
} from '../components/notion/resumeApi';

export const revalidate = 10;

export const metadata: Metadata = {
  title: `${RESUME_DATA.name} | ${RESUME_DATA.about}`,
  description: RESUME_DATA.summary,
};

export default async function Page() {
  /*-------------------------------------*/
  // FETCH resumeData from NOTION

  let resumeData = await resumeApi.getData();
  // console.log(resumeData);

  /*-------------------------------------*/
  // FILTER resumeData IF TO CURRENT PAGE

  resumeData = filterLifeApi(resumeData,"refPage","/");
  // console.log(resumeData);
  
  /*-------------------------------------*/
  // TRANFORM resumeData OF CATEGORY TEXT & ARRAY FROM ITS PARENT NOTION DB FORMAT

  // console.log(resumeData.text);
  // console.log(resumeData.array);
  resumeData = transformLifeApi(resumeData,["text","array"]);
  // console.log(resumeData);

  /*-------------------------------------*/
  // SELECT {resumeData} OR {RESUME_DATA} BASIS INPUT FROM "resumeData.transformedText.dataSource"

  // console.log(resumeData.transformedText?.dataSource);

  // console.log(resumeData?.transformedText?.developerCredit);
  const devCredit = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.transformedText?.developerCredit
      ? parseText(resumeData?.transformedText?.developerCredit as string)
      : ""
    : "";
  // console.log(devCredit);

  // console.log(RESUME_DATA.name);
  const name = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.transformedText?.name
      ? onlyText(resumeData.transformedText?.name as string)
      : ""
    : RESUME_DATA.name;
  // console.log(name);
  
  // console.log(RESUME_DATA.detailedCVUrl);
  const resumeDownloadLink = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.transformedText?.detailedCVURL
      ? parseHyperlinkedText(resumeData.transformedText?.detailedCVURL as string)[0].link
      : ""
    : '';
  // console.log(resumeDownloadLink);
  
  // console.log(RESUME_DATA.about);
  const about = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.transformedText?.oneLineSummary
      ? onlyText(resumeData.transformedText?.oneLineSummary as string)
      : ""
    : RESUME_DATA.about;
  // console.log(about);
  
  // console.log(RESUME_DATA.location);
  const currLoc = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.transformedText?.currentLocation
      ? parseHyperlinkedText(resumeData.transformedText?.currentLocation as string)[0].text
      : ""
    : RESUME_DATA.location;
  // console.log(currLoc);
  
  // console.log(RESUME_DATA.locationLink);
  const currLocLink = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.transformedText?.currentLocation
      ? parseHyperlinkedText(resumeData.transformedText?.currentLocation as string)[0].link
      : ""
    : RESUME_DATA.locationLink;
  // console.log(currLocLink);
  
  // console.log(RESUME_DATA.contact.email);
  const email = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.transformedText?.publicEmail
      ? parseHyperlinkedText(resumeData.transformedText?.publicEmail as string)[0].text
      : ""
    : RESUME_DATA.contact.email;
  // console.log(email);

  // console.log(RESUME_DATA.contact.tel);
  const tel = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.transformedText?.publicPhoneNumber
      ? parseHyperlinkedText(resumeData.transformedText?.publicPhoneNumber as string)[0].text
      : ""
    : RESUME_DATA.contact.tel;
  // console.log(tel);
  
  // console.log(RESUME_DATA.contact.social);
  // console.log(parseSocialMediaData(resumeData.socialMedia || []));
  const social = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.socialMedia
      ? parseSocialMediaData(resumeData.socialMedia || [],resumeData.transformedArray?.publicResumeSocialLinks as string[])
      : []
    : RESUME_DATA.contact.social;
  // console.log(social);

  // console.log(RESUME_DATA.personalWebsiteUrl);
  const homeNavLink = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.transformedText?.personalWebsiteURL
      ? parseHyperlinkedText(resumeData.transformedText?.personalWebsiteURL as string)[0].link
      : ""
    : RESUME_DATA.personalWebsiteUrl;
  // console.log(homeNavLink);
  
  // console.log(RESUME_DATA.avatarUrl);
  const avatarLink = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.transformedText?.avatarURL
      ? parseHyperlinkedText(resumeData.transformedText?.avatarURL as string)[0].link
      : ""
    : RESUME_DATA.avatarUrl;
  // console.log(avatarLink);

  const avatarToolTip = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.transformedText?.avatarToolTip
      ? parseHyperlinkedText(resumeData.transformedText?.avatarToolTip as string)[0].text
      : ""
    : '';
  // console.log(avatarToolTip);
  
  // console.log(RESUME_DATA.initials);
  const initials = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.transformedText?.initials
      ? onlyText(resumeData.transformedText?.initials as string)
      : ""
    : RESUME_DATA.initials;
  // console.log(initials);
  
  // console.log(RESUME_DATA.summary);
  const summary = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.transformedText?.aboutSummary
      ? onlyText(resumeData.transformedText?.aboutSummary as string)
      : ""
    : RESUME_DATA.summary;
  // console.log(summary);
  
  // console.log(RESUME_DATA.work[1]);
  const work = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.work
      ? parseWorkData(resumeData.work || [],resumeData.transformedArray?.publicResumeWork as string[])
      : []
    : RESUME_DATA.work;
  // console.log(work[1]);

  // console.log(RESUME_DATA.education[0]);
  const education = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.education
      ? parseEducationData(resumeData.education || [],resumeData.transformedArray?.publicResumeEducation as string[])
      : []
    : RESUME_DATA.education;
  // console.log(education[0]);

  // console.log(RESUME_DATA.skills);
  // console.log(RESUME_DATA.skills.tech[0]);
  const skills = resumeData?.transformedText?.dataSource === "Notion"
    ? resumeData?.skills
      ? parseToolData(resumeData.skills || [])
      : {}
    : RESUME_DATA.skills;
  // console.log(skills);
  // console.log(skills.tech?.[0]);

  // console.log(RESUME_DATA.projects[0]);
  const projects = resumeData?.transformedText?.dataSource === "Notion"
    ? [
        ...(resumeData.myCurrentProjects || []),
        ...(resumeData.artifacts || []),
        ...(resumeData.myPastProjects || []),
        ]
      ? parseProjectsData(
          [
            ...(resumeData.artifacts || []),
            ...(resumeData.myCurrentProjects || []),
            ...(resumeData.myPastProjects || []),
            ]
            .sort((itemA, itemB) => {
              // Handle potential missing keyOrder properties
              if (!itemA.hasOwnProperty('keyOrder') || !itemB.hasOwnProperty('keyOrder')) {
                return 0; // Return 0 to avoid errors if keyOrder is missing
              }
              // Sort based on keyOrder (ascending order)
              // console.log(itemA.title, itemB.title);
              return Number(itemA.keyOrder) - Number(itemB.keyOrder);
            }),
          [
            ...(resumeData.transformedArray?.publicResumeArtifacts as string[] || []),
            ...(resumeData.transformedArray?.publicResumeProjects as string[] || []),
            ]
        )
      : []
    : RESUME_DATA.projects;
  // console.log(projects);

  /*-------------------------------------*/
  // UPDATE METADATA
  metadata.title = resumeData?.transformedText?.dataSource === "Notion" ? `${name} - ${about}` : metadata.title;
  metadata.description = resumeData?.transformedText?.dataSource === "Notion" ? summary : metadata.description;
  
  /*-------------------------------------*/
  // RENDER CURRENT PAGE
  
  return (
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
      <section className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1.5">
            <h1 className="text-2xl font-bold">
              {name}
              {resumeDownloadLink &&
                <Button 
                  className="ml-2 h-7 w-7 bg-zinc-200 print:hidden" 
                  variant="outline"
                  size="icon"
                  asChild
                  dataToolTip="Download Detailed CV"
                  >
                  <a 
                    href={resumeDownloadLink} 
                    target="_blank"
                    >
                    <ArrowDownIcon className="h-4 w-4" />
                  </a>
                </Button>
              }
            </h1>
            <p className="max-w-md text-pretty font-mono text-sm text-muted-foreground">
              {about}
            </p>
            <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
              <a
                className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                href={currLocLink}
                target="_blank"
              >
                <GlobeIcon className="size-3" />
                {currLoc}
              </a>
            </p>
            <div className="flex gap-x-1 pt-1 font-mono text-sm text-muted-foreground print:hidden">
              {email ? (
                <Button
                  className="size-8"
                  variant="outline"
                  size="icon"
                  asChild
                  dataToolTip="Email Me!"
                >
                  <a href={`mailto:${email}`}>
                    <MailIcon className="size-4" />
                  </a>
                </Button>
              ) : null}
              {tel ? (
                <Button
                  className="size-8"
                  variant="outline"
                  size="icon"
                  asChild
                  dataToolTip="Call Me!"
                >
                  <a href={`tel:${tel}`}>
                    <PhoneIcon className="size-4" />
                  </a>
                </Button>
              ) : null}
              {social.map((social) => (
                <Button
                  key={social.name}
                  className="size-8"
                  variant="outline"
                  size="icon"
                  asChild
                  dataToolTip={social.name}
                >
                  <a href={social.link} target="_blank">
                    {social.icon && 
                    <social.icon 
                      className="size-4" 
                      // width="24" height="24"
                    />
                    }
                  </a>
                </Button>
              ))}
            </div>
            <div className="hidden flex-col gap-x-1 font-mono text-sm text-muted-foreground print:flex">
              {email ? (
                <a href={`mailto:${email}`}>
                  <span className="underline">{email}</span>
                </a>
              ) : null}
              {tel ? (
                <a href={`tel:${tel}`}>
                  <span className="underline">{tel}</span>
                </a>
              ) : null}
            </div>
          </div>

          <Avatar 
            className="size-28"
            dataToolTip={avatarToolTip || ''}
            >
            <Link href={homeNavLink || ''}>
              <AvatarImage alt={name} src={avatarLink} />
            </Link>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </div>
        <Section>
          <h2 className="text-xl font-bold">About</h2>
          <p className="text-pretty font-mono text-sm text-muted-foreground">
            {summary}
          </p>
        </Section>
        <Section>
          <h2 className="text-xl font-bold">Work Experience</h2>
          {work.map((item) => {
            return (
              <Card key={item.company}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-x-2 text-base">
                    <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                      <a className="hover:underline" href={item.link}>
                        {item.company}
                      </a>

                      {item.badges && 
                        <span className="inline-flex gap-x-1">
                          {item.badges.map((badge) => (
                            <Badge
                              variant="secondary"
                              className="align-middle text-xs"
                              key={badge}
                            >
                              {badge}
                            </Badge>
                          ))}
                        </span>
                      }
                    </h3>
                    <div className="text-sm tabular-nums text-gray-500">
                      {item.start} - {item.end ?? "Present"}
                    </div>
                  </div>

                  <h4 className="font-mono text-sm leading-none">
                    {item.title}
                  </h4>
                </CardHeader>
                <CardContent className="mt-2 text-xs">
                  {item.description}
                </CardContent>
              </Card>
            );
          })}
        </Section>
        <Section>
          <h2 className="text-xl font-bold">Education</h2>
          {education.map((item) => {
            return (
              <Card key={item.school}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-x-2 text-base">
                    <h3 className="font-semibold leading-none">
                      {item.school}
                    </h3>
                    <div className="text-sm tabular-nums text-gray-500">
                      {item.start} - {item.end}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="mt-2">{item.degree}</CardContent>
              </Card>
            );
          })}
        </Section>
        <Section>
          <h2 className="text-xl font-bold">Skills</h2>
          <div className="flex flex-wrap gap-1">
            {skills && Object.entries(skills).flatMap(([category, value]) => 
              value.map((skill:string) => {
                return <Badge key={skill as string}>{skill as string}</Badge>;
              })
            )}
          </div>
        </Section>

        <Section className="scroll-mb-16">
          <h2 className="text-xl font-bold">Projects</h2>
          <div className="-mx-3 grid grid-cols-1 gap-3 print:grid-cols-3 print:gap-2 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => {
              return (
                <ProjectCard
                  key={project.title}
                  title={project.title || ''}
                  description={project.description || ''}
                  tags={project.techStack ? project.techStack : []}
                  link={"link" in project ? project.link : undefined}
                />
              );
            })}
          </div>
        </Section>

        {devCredit && (
          <Section className="print:hidden items-center">
            <p className="text-pretty font-mono text-sm text-muted-foreground">
              Developed By: {devCredit}
            </p>
          </Section>
        )}
      </section>

      <CommandMenu
        links={[
          {
            url: homeNavLink || '',
            title: "Personal Website",
          },
          ...social.map((socialMediaLink) => ({
            url: socialMediaLink.link || '',
            title: socialMediaLink.name || '',
          })),
        ]}
      />
    </main>
  );
}
