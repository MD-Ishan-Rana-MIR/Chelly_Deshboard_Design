import { useDashboardStatasQuery } from '../../api/dashboard/dashboardApi'
import DashboardSkeleton from '../../components/skeleton/DashboardSkeleton';
import RecentActivities from './RecentActivities'
import StatsCard from './StatsCard'

export interface Order {
    id: number;
    user_id: number;
    order_number: string;
    status: "pending" | "processing" | "delivered" | "cancelled" | string;
    total_amount: string;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
};

export interface Statas {
    total_users: number;
    total_categories: number;
    total_foods: number;
    total_orders: number
}

const HomePage = () => {
    const { data ,isLoading} = useDashboardStatasQuery(undefined);
    const statisticsData: Statas = data?.data?.statistics;
    const resentOrder: Order[] = data?.data?.recent_orders || [];

    if(isLoading){
        return(
            <div>
                <DashboardSkeleton/>
            </div>
        )
    }

    return (
        <div>
            <h1 className=' text-[33px] font-semibold mb-10  text-white ' >Dashboard</h1>
            <StatsCard statisticsData={statisticsData} />
            <RecentActivities resentOrder = {resentOrder}  />
        </div>
    )
}

export default HomePage