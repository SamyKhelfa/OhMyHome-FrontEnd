"use client";
import "@ant-design/v5-patch-for-react-19";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Row, Col, Card, Spin } from "antd";

const API_URL = "http://localhost:3000/api";
const token = Cookies.get("token");

type Property = {
  id: number;
  title: string;
  location: string;
  price: number;
  surface: number;
  images: string[];
};

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/properties/favorites/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setFavorites(data);
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <Spin size="large" />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">❤️ Mes Favoris</h1>
      <Row gutter={[16, 16]}>
        {favorites.map((prop) => (
          <Col key={prop.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={() => router.push(`/properties/${prop.id}`)}
              cover={
                <img
                  src={prop.images[0]}
                  alt={prop.title}
                  className="h-48 w-full object-cover"
                />
              }
            >
              <Card.Meta
                title={prop.title}
                description={`${prop.location} - ${
                  prop.surface
                }m² - ${prop.price.toLocaleString()}€`}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
