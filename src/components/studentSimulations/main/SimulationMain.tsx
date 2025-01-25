import AnalyzeMain from "../components/AnalyzeMain";
import ProjectDiscussBox from "../components/ProjectDiscussBox";

export default function SimulationMain() {
  return (
    <div className="flex w-full gap-4 p-5 max-lg:flex-col">
      <ProjectDiscussBox/>
      <AnalyzeMain/>
    </div>
  )
}
