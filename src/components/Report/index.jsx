import { useEffect, useState } from "react";
import { getTotalCustomer, getTotalRevenue } from "../../services/reportService";
import ReportCard from "../ReportCard";
import './Report.css';

export default function ReportPage() {

 const [totalAmount, setTotalAmount] = useState(0);
 const [totalCustomer, setTotalCustomer] = useState(0);
 const [loading, setLoading] = useState(true);


 const fetchTotalCustomer = async () => {
  const result = await getTotalCustomer()
  console.log(result)
  setTotalCustomer(result.data.data)
 }

 const fetchTotalRevenue = async () => {
  const result = await getTotalRevenue()
  setTotalAmount(result.data.data)
 }

 const fetchReports = async () => {
  try {
   setLoading(true);
   await Promise.all([
    fetchTotalRevenue(),
    fetchTotalCustomer()
   ]);
  } catch (error) {
   console.error('Error fetching reports:', error);
  } finally {
   setLoading(false);
  }
 }

 useEffect(() => {
  fetchReports()
 }, [])

 if (loading) {
  return (
   <div className="report-page">
    <div className="report-page__loading">
     <div className="report-page__spinner"></div>
     Loading reports...
    </div>
   </div>
  );
 }

 return (
  <div className="report-page">
   <div className="report-page__header">
    <h1 className="report-page__title">Reports & Analytics</h1>
    <p className="report-page__subtitle">View your business performance metrics</p>
   </div>
   <div className="report-page__cards">
    <h1>Amount</h1>
    <ReportCard title="Total Revenue" value={totalAmount} />
    <br />
    <h1>Customer</h1>
    <ReportCard title="Total Customer" value={totalCustomer} />
   </div>
  </div>
 )
}