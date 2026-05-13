import RecentActivities from './RecentActivities'
import StatsCard from './StatsCard'

const HomePage = () => {
    return (
        <div>
            <h1 className=' text-[33px] font-semibold mb-10  text-white ' >Dashboard</h1>
            <StatsCard />
            <RecentActivities />
        </div>
    )
}

export default HomePage