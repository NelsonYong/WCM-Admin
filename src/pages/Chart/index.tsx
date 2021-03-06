import UserSkillChart from './Components/UserSkillChart';
import CommentLine from './Components/CommentLine';
import UserCommentColumn from './Components/UserCommentColumn';
import ToolTipRadar from './Components/ToolTipRadar';
import LoginChart from './Components/LoginChart';


const Chart = () => {
  return (
    <div className="h-full grid grid-rows-2 grid-cols-3 gap-4">
      <div>
        <UserSkillChart />
      </div>
      <div>
        <CommentLine />
      </div>
      <div>
        <UserCommentColumn />
      </div>
      <div><ToolTipRadar /></div>
      <div className="col-span-2"><LoginChart /></div>
    </div>
  );
};

export default Chart;
