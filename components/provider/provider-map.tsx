"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import type { Provider } from "@/lib/types"


import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import OSM from "ol/source/OSM"
import VectorSource from "ol/source/Vector"
import Feature from "ol/Feature"
import Point from "ol/geom/Point"
import { fromLonLat } from "ol/proj"
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style"

interface ProviderMapProps {
  provider: Provider
}

export function ProviderMap({ provider }: ProviderMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<Map | null>(null)
  const vectorSourceRef = useRef<VectorSource | null>(null)

  
  useEffect(() => {
    if (!mapRef.current) return

    const baseLayer = new TileLayer({ source: new OSM() })
    const vectorSource = new VectorSource()
    vectorSourceRef.current = vectorSource
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new CircleStyle({
          radius: 8,
          fill: new Fill({ color: "#2563eb" }), 
          stroke: new Stroke({ color: "#ffffff", width: 2 }),
        }),
      }),
    })

    const view = new View({
      center: fromLonLat([-51.9253, -14.235]), 
      zoom: 4,
    })

    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer, vectorLayer],
      view,
    })
    mapInstance.current = map

    return () => {
      map.setTarget(undefined)
      mapInstance.current = null
      vectorSourceRef.current = null
    }
  }, [])

  
  useEffect(() => {
    const map = mapInstance.current
    const vectorSource = vectorSourceRef.current
    if (!map || !vectorSource) return

    vectorSource.clear()

    const lat = provider?.location?.coordinates?.lat
    const lng = provider?.location?.coordinates?.lng
    const valid =
      typeof lat === "number" && typeof lng === "number" && isFinite(lat) && isFinite(lng) && !(lat === 0 && lng === 0)

    if (valid) {
      const coord = fromLonLat([lng as number, lat as number])
      const feature = new Feature({ geometry: new Point(coord) })
      vectorSource.addFeature(feature)

      
      const view = map.getView()
      const targetZoom = Math.max(view.getZoom() ?? 4, 15)
      view.animate({ center: coord, duration: 250 })
      view.animate({ zoom: targetZoom, duration: 250 })
    } else {
      
      const view = map.getView()
      view.setCenter(fromLonLat([-51.9253, -14.235]))
      view.setZoom(4)
    }
  }, [provider])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Localização
        </CardTitle>
        <CardDescription>Visualização da localização do prestador</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-video rounded-lg border overflow-hidden bg-muted">
          <div ref={mapRef} className="absolute inset-0" />
          {!provider?.location?.coordinates ||
          !isFinite(provider.location.coordinates.lat as any) ||
          !isFinite(provider.location.coordinates.lng as any) ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="font-medium">{provider.name}</p>
                  <p className="text-sm text-muted-foreground">Sem coordenadas para exibir no mapa</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          O mapa centraliza e dá zoom na localização do prestador quando disponível.
        </p>
      </CardContent>
    </Card>
  )
}
