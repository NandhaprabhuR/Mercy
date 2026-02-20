import './DashboardOverview.css';

export default function DashboardOverview() {
    return (
        <div className="admin-overview">
            <div className="dashboard-header">
                <h2>Dashboard Overview</h2>
                <div className="date-picker">Today: {new Date().toLocaleDateString()}</div>
            </div>

            <div className="kpi-grid">
                <div className="kpi-card">
                    <h4>Total Revenue</h4>
                    <p className="kpi-value">$12,450.00</p>
                    <span className="kpi-trend positive">↑ +14.5%</span>
                </div>
                <div className="kpi-card">
                    <h4>Orders Today</h4>
                    <p className="kpi-value">48</p>
                    <span className="kpi-trend positive">↑ +5.2%</span>
                </div>
                <div className="kpi-card">
                    <h4>Active Users</h4>
                    <p className="kpi-value">1,204</p>
                    <span className="kpi-trend negative">↓ -1.2%</span>
                </div>
                <div className="kpi-card">
                    <h4>Conversion Rate</h4>
                    <p className="kpi-value">3.2%</p>
                    <span className="kpi-trend positive">↑ +0.4%</span>
                </div>
            </div>

            <div className="charts-area">
                <div className="chart-placeholder main-chart">
                    <h4>Revenue over Time</h4>
                    {/* Mocking a chart visual with CSS */}
                    <div className="mock-chart-bars">
                        <div className="bar" style={{ height: '30%' }}></div>
                        <div className="bar" style={{ height: '50%' }}></div>
                        <div className="bar" style={{ height: '40%' }}></div>
                        <div className="bar" style={{ height: '70%' }}></div>
                        <div className="bar" style={{ height: '60%' }}></div>
                        <div className="bar" style={{ height: '90%' }}></div>
                        <div className="bar" style={{ height: '85%' }}></div>
                    </div>
                </div>

                <div className="chart-placeholder secondary-chart">
                    <h4>Top Selling Products</h4>
                    <ul className="top-products-list">
                        <li>1. PEAK Performance Tee (142 sold)</li>
                        <li>2. PEAK Recovery Protein (98 sold)</li>
                        <li>3. PEAK Pro Dumbbells (45 sold)</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
