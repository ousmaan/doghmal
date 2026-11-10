import React from "react";
import { Link } from "react-router-dom";

interface DemoCardProps {
  title: string;
  description: string;
  route: string;
}

const DemoCard: React.FC<DemoCardProps> = ({ title, description, route }) => (
  <Link to={route} className="group bg-[#1f1f23] text-white p-6 rounded-lg shadow-card hover:shadow-lift transition-shadow">
    <h3 className="text-xl font-bold">{title}</h3>
    <p className="mt-1 text-sm">{description}</p>
  </Link>
);

export default DemoCard;