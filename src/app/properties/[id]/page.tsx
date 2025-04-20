"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Carousel, Tag, Divider, Button, message } from "antd";
import Image from "next/image";
import {
  HomeOutlined,
  DollarOutlined,
  ExpandOutlined,
  EnvironmentOutlined,
  RiseOutlined,
  CalendarOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";

const API_URL = "http://localhost:3000/api";
const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

type Property = {
  id: number;
  title: string;
  description: string;
  location: string;
  price: number;
  surface: number;
  bedrooms: number;
  floor?: number;
  type: string;
  constructionYear?: number;
  hasElevator: boolean;
  hasCellar: boolean;
  images: string[];
};

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params?.id;
  const [property, setProperty] = useState<Property | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/api/properties/${id}`)
        .then((res) => res.json())
        .then((data) => setProperty(data));
    }

    if (token) {
      fetch(`${API_URL}/properties/favorites/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data: { id: number }[]) => setFavorites(data.map((p) => p.id)));
    }
  }, [id]);

  const toggleFavorite = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      message.error("Veuillez vous connecter pour ajouter aux favoris.");
      return;
    }

    const isFav = favorites.includes(id);

    try {
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
      } else {
        message.error("Erreur lors de la mise à jour des favoris.");
      }
    } catch {
      message.error("Impossible de mettre à jour les favoris.");
    }
  };

  if (!property) return <div className="p-6 text-center">Chargement...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Carousel dots className="rounded-xl overflow-hidden mb-6">
        {property.images.map((url, index) => (
          <div className="relative" key={index}>
            <Image
              src={url}
              alt={`Image ${index + 1}`}
              width={800}
              height={400}
              className="h-[400px] w-full object-cover"
            />
            <div
              className="absolute top-2 right-2 bg-white rounded-full p-1 z-10"
              onClick={(e) => {
                e.stopPropagation(); // empêche la redirection
                toggleFavorite(property.id, e);
              }}
            >
              {favorites.includes(property.id) ? (
                <HeartFilled style={{ color: "red", fontSize: 20 }} />
              ) : (
                <HeartOutlined style={{ fontSize: 20 }} />
              )}
            </div>
          </div>
        ))}
      </Carousel>

      <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
      <div className="text-gray-500 text-lg mb-4 flex items-center gap-2">
        <EnvironmentOutlined /> {property.location}
      </div>

      <div className="flex items-center gap-4 flex-wrap mb-4">
        <Tag icon={<DollarOutlined />} color="green">
          {property.price.toLocaleString()} €
        </Tag>
        <Tag icon={<ExpandOutlined />} color="blue">
          {property.surface} m²
        </Tag>
        <Tag icon={<HomeOutlined />} color="volcano">
          {property.bedrooms} chambre{property.bedrooms > 1 ? "s" : ""}
        </Tag>
        <Tag icon={<RiseOutlined />} color="purple">
          {property.floor !== null ? `Étage ${property.floor}` : "RDC"}
        </Tag>
        <Tag icon={<CalendarOutlined />} color="geekblue">
          {property.constructionYear || "Année inconnue"}
        </Tag>
      </div>

      <Divider />

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">À propos du bien</h2>
        <p className="text-gray-700">{property.description}</p>
      </div>

      <div className="flex flex-wrap gap-4">
        {property.hasElevator && <Tag color="cyan">Ascenseur</Tag>}
        {property.hasCellar && <Tag color="gold">Cave</Tag>}
        <Tag>{property.type}</Tag>
      </div>

      <Divider />

      <div className="mt-6">
        <Button type="primary" size="large">
          Contacter l’agence
        </Button>
      </div>
    </div>
  );
}
