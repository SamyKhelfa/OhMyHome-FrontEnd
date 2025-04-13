"use client";
import { Card, Row, Col, Spin, Carousel, Button } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LeftOutlined,
  RightOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";

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

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch(`${API_URL}/properties`)
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        setLoading(false);
      });

    if (token) {
      fetch(`${API_URL}/properties/favorites/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setFavorites(data.map((p: any) => p.id)));
    }
  }, []);

  const toggleFavorite = async (id: number) => {
    if (!token) return;

    const isFav = favorites.includes(id);

    const res = await fetch(`${API_URL}/properties/${id}/favorite`, {
      method: isFav ? "DELETE" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setFavorites((prev) =>
        isFav ? prev.filter((fid) => fid !== id) : [...prev, id]
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">🏠 Annonces disponibles</h1>
        <Button type="primary" onClick={() => router.push("/favorites")}>
          Voir mes favoris
        </Button>
      </div>{" "}
      {loading ? (
        <Spin size="large" />
      ) : (
        <Row gutter={[16, 16]}>
          {properties.map((prop) => (
            <Col key={prop.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="hover:size=25"
                onClick={() => router.push(`/properties/${prop.id}`)}
                cover={
                  <div className="relative">
                    {prop.images?.length > 0 && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <Carousel arrows={prop.images.length > 1}>
                          {prop.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Image ${index + 1}`}
                              className="h-48 w-full object-cover"
                            />
                          ))}
                        </Carousel>
                      </div>
                    )}
                    <div
                      className="absolute top-2 right-2 bg-white rounded-full p-1 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(prop.id);
                      }}
                    >
                      {favorites.includes(prop.id) ? (
                        <HeartFilled style={{ color: "red", fontSize: 20 }} />
                      ) : (
                        <HeartOutlined style={{ fontSize: 20 }} />
                      )}
                    </div>
                  </div>
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
      )}
    </div>
  );
}
