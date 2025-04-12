"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Carousel, Tag, Divider, Button } from "antd";
import {
  HomeOutlined,
  DollarOutlined,
  ExpandOutlined,
  EnvironmentOutlined,
  RiseOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

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

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/api/properties/${id}`)
        .then((res) => res.json())
        .then((data) => setProperty(data));
    }
  }, [id]);

  if (!property) return <div className="p-6 text-center">Chargement...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Carrousel d’images */}
      <Carousel dots className="rounded-xl overflow-hidden mb-6">
        {property.images.map((url, index) => (
          <div key={index}>
            <img
              src={url}
              alt={`Image ${index + 1}`}
              className="h-[400px] w-full object-cover"
            />
          </div>
        ))}
      </Carousel>

      {/* Infos principales */}
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

      {/* Description */}
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

      {/* CTA Contact (placeholder) */}
      <div className="mt-6">
        <Button type="primary" size="large">
          Contacter l’agence
        </Button>
      </div>
    </div>
  );
}
