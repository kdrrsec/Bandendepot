"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import { Building2, Clock, Package, Tag, ShoppingCart } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    companies: 0,
    pendingCompanies: 0,
    products: 0,
    brands: 0,
    orders: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [companiesRes, productsRes, brandsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/companies"),
        fetch("/api/admin/products"),
        fetch("/api/admin/brands"),
        fetch("/api/admin/orders"),
      ]);

      const companies = await companiesRes.json();
      const products = await productsRes.json();
      const brands = await brandsRes.json();
      const orders = await ordersRes.json();

      setStats({
        companies: companies.total || 0,
        pendingCompanies:
          companies.companies?.filter((c: any) => c.status === "PENDING")
            .length || 0,
        products: products.total || 0,
        brands: brands.total || 0,
        orders: orders.total || 0,
        pendingOrders:
          orders.orders?.filter((o: any) => o.status === "PENDING" || o.status === "PAID")
            .length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overzicht van het platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Totaal Bedrijven</p>
              <p className="text-2xl font-bold text-primary">{stats.companies}</p>
            </div>
            <div className="bg-primary bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Behandeling</p>
              <p className="text-2xl font-bold text-primary">
                {stats.pendingCompanies}
              </p>
            </div>
            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-800" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Producten</p>
              <p className="text-2xl font-bold text-primary">{stats.products}</p>
            </div>
            <div className="bg-primary bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Merken</p>
              <p className="text-2xl font-bold text-primary">{stats.brands}</p>
            </div>
            <div className="bg-primary bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center">
              <Tag className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Totaal Bestellingen</p>
              <p className="text-2xl font-bold text-primary">{stats.orders}</p>
            </div>
            <div className="bg-primary bg-opacity-10 w-12 h-12 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}







