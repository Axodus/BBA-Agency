import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ProjectExamplePage } from "../components/projects/ProjectExamplePage.js";
import { getAgencyProjectByRouteSegment } from "../content/projects/index.js";
import { Unavailable } from "./Unavailable.js";

export function ProjectDetail() {
  const { projectSlug } = useParams<{ projectSlug: string }>();
  const project = projectSlug ? getAgencyProjectByRouteSegment(projectSlug) : undefined;

  useEffect(() => {
    document.title = project?.seo.title ?? "Unavailable | BBA Agency";
    return () => { document.title = "BBA Agency"; };
  }, [project]);

  return project ? <ProjectExamplePage project={project} /> : <Unavailable />;
}
