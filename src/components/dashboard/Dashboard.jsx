import React from 'react'
import MonthlyReport from './MonthlyReportGraph'
import SalesCard from './SalesCard'
import DashboardSales from './DashboardSales'

const Dashboard = () => {
  return (
    <div>

      <div className="row g-3">
        <div className="col-lg-8"> 
            <SalesCard /></div>
        <div className="col-lg-4">   <MonthlyReport /></div>
        <div className="col-12">
          <DashboardSales/>
        </div>
      </div>

    </div>
  )
}

export default Dashboard