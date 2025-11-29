"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import type { Provider } from "@/lib/types"


import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import Heatmap from "ol/layer/Heatmap"
import OSM from "ol/source/OSM"
import VectorSource from "ol/source/Vector"
import Cluster from "ol/source/Cluster"
import Feature, { type FeatureLike } from "ol/Feature"
import Point from "ol/geom/Point"
import { fromLonLat } from "ol/proj"
import { Style, Fill, Stroke, Circle as CircleStyle, Text } from "ol/style"
import Overlay from "ol/Overlay"

import { Button } from "@/components/ui/button"


interface NetworkMapProps {
  providers: Provider[]
}

export function NetworkMap({ providers }: NetworkMapProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)

  const mapRef = useRef<HTMLDivElement | null>(null)
  const popupRef = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<Map | null>(null)
  const vectorSourceRef = useRef<VectorSource | null>(null)
  const clusterSourceRef = useRef<Cluster | null>(null)
  const overlayRef = useRef<Overlay | null>(null)

  const validProviders = useMemo(
    () =>
      providers.filter(
        (p) =>
          typeof p.location?.coordinates?.lat === "number" &&
          typeof p.location?.coordinates?.lng === "number" &&
          isFinite(p.location.coordinates.lat) &&
          isFinite(p.location.coordinates.lng)
      ),
    [providers]
  )

  const getColorByStatus = (status: Provider["status"]) => {
    switch (status) {
      case "active":
        return "#22c55e" 
      case "under_review":
        return "#eab308" 
      case "contract_ended":
        return "#ef4444" 
      default:
        return "#6b7280" 
    }
  }

  
  useEffect(() => {
    if (!mapRef.current) return

    const baseLayer = new TileLayer({
      source: new OSM(),
    })

    const vectorSource = new VectorSource()
    vectorSourceRef.current = vectorSource

    
    const clusterSource = new Cluster({ distance: 40, minDistance: 20, source: vectorSource })
    clusterSourceRef.current = clusterSource

    const vectorLayer = new VectorLayer({
      source: clusterSource,
      style: (feature: FeatureLike) => {
        const inner = feature.get("features") as Feature<Point>[] | undefined
        const size = inner?.length ?? 1
        if (size > 1) {
          
          return new Style({
            image: new CircleStyle({
              radius: Math.min(10 + size, 22),
              fill: new Fill({ color: "rgba(59,130,246,0.75)" }), 
              stroke: new Stroke({ color: "#ffffff", width: 2 }),
            }),
            text: new Text({
              text: String(size),
              font: "bold 12px sans-serif",
              fill: new Fill({ color: "#fff" }),
              stroke: new Stroke({ color: "rgba(0,0,0,0.4)", width: 3 }),
            }),
          })
        }
        
        const status = (inner && inner[0]?.get("status")) as Provider["status"] | undefined
        const color = getColorByStatus(status || "inactive")
        return new Style({
          image: new CircleStyle({
            radius: 7,
            fill: new Fill({ color }),
            stroke: new Stroke({ color: "#ffffff", width: 2 }),
          }),
        })
      },
    })

    
    const heatmapLayer = new Heatmap({
      source: vectorSource,
      blur: 20,
      radius: 14,
      weight: (feature) => Number(feature.get('weight') ?? 1),
      visible: true,
    })

    

    const view = new View({
      center: fromLonLat([-51.9253, -14.2350]), 
      zoom: 4,
    })

    const map = new Map({
      target: mapRef.current,
      layers: [baseLayer, heatmapLayer, vectorLayer],
      view,
    })
    mapInstance.current = map

    
    if (popupRef.current) {
      const overlay = new Overlay({
        element: popupRef.current,
        autoPan: { animation: { duration: 250 } },
        offset: [0, -12],
        positioning: "bottom-center",
      })
      overlayRef.current = overlay
      map.addOverlay(overlay)
    }

    
    map.on("singleclick" as any, (evt: any) => {
      let clicked = false
      map.forEachFeatureAtPixel(evt.pixel, (feature: FeatureLike) => {
        const inner = feature.get("features") as Feature<Point>[] | undefined
        const size = inner?.length ?? 0
        const coord = (feature.getGeometry() as Point | undefined)?.getCoordinates()
        if (size > 1) {
          
          const view = map.getView()
          if (coord) {
            view.animate({ center: coord, zoom: (view.getZoom() ?? 10) + 1, duration: 200 })
          }
          clicked = true
        } else if (size === 1) {
          const prov = inner![0].get("provider") as Provider | undefined
          if (prov) {
            setSelectedProvider(prov)
            if (coord) overlayRef.current?.setPosition(coord)
            clicked = true
          }
        }
      })
      if (!clicked) {
        setSelectedProvider(null)
        overlayRef.current?.setPosition(undefined)
      }
    })

    return () => {
      
      map.setTarget(undefined)
      mapInstance.current = null
      vectorSourceRef.current = null
      overlayRef.current = null
    }
  }, [])

  
  useEffect(() => {
  const vectorSource = vectorSourceRef.current
  const map = mapInstance.current
  if (!vectorSource || !map) return

    vectorSource.clear()

    const features: Feature<Point>[] = []
    for (const p of validProviders) {
      const { lat, lng } = p.location.coordinates
      
      if (!isFinite(lat) || !isFinite(lng) || (lat === 0 && lng === 0)) continue
      const feature = new Feature({
        geometry: new Point(fromLonLat([lng, lat])),
        id: p.id,
        status: p.status,
        provider: p,
        weight: p.isStrategicPartner ? 2 : 1,
      })
      features.push(feature)
    }
    vectorSource.addFeatures(features)

    
    if (features.length > 0) {
      const extent = vectorSource.getExtent()
      try {
        
        map.getView().fit(extent, { padding: [48, 48, 48, 48], maxZoom: 14, duration: 400 })

        
        if (features.length === 1) {
          map.getView().setZoom(Math.max(map.getView().getZoom() ?? 12, 14))
        }
      } catch {
        
      }
    } else {
      
      map.getView().setCenter(fromLonLat([-51.9253, -14.2350]))
      map.getView().setZoom(5)
    }
  }, [validProviders])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Mapa da Rede Credenciada
        </CardTitle>
        <CardDescription>Visualização geográfica dos prestadores com filtros aplicados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-96 rounded-lg border overflow-hidden">
          {}
          <div ref={mapRef} className="absolute inset-0" />

          {}
          <div ref={popupRef} className="pointer-events-none">
            {selectedProvider && (
              <div className="pointer-events-auto bg-white rounded-md shadow-lg border p-3 text-xs min-w-56">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-sm truncate mr-2">{selectedProvider.name}</div>
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: getColorByStatus(selectedProvider.status) }}
                  />
                </div>
                <div className="text-muted-foreground">
                  {selectedProvider.location.city}, {selectedProvider.location.state}
                </div>
                {selectedProvider.specialties?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {selectedProvider.specialties.slice(0, 3).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {s}
                      </span>
                    ))}
                    {selectedProvider.specialties.length > 3 && (
                      <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        +{selectedProvider.specialties.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                const clusterSource = clusterSourceRef.current
                const map = mapInstance.current
                if (!clusterSource || !map) return
                const features = clusterSource.getFeatures() as Feature<Point>[]
                if (!features.length) return
                let maxSize = 0
                let best: Feature<Point> | null = null
                for (const f of features) {
                  const size = (f.get('features') as Feature<Point>[] | undefined)?.length ?? 0
                  if (size >= maxSize) {
                    maxSize = size
                    best = f
                  }
                }
                const coord = (best?.getGeometry() as Point | undefined)?.getCoordinates()
                const view = map.getView()
                if (coord) {
                  view.animate({ center: coord, duration: 250 })
                  const targetZoom = Math.max((view.getZoom() ?? 10) + (maxSize > 1 ? 2 : 0), 12)
                  view.animate({ zoom: targetZoom, duration: 300 })
                }
              }}
            >
              Centralizar maior grupo
            </Button>
          </div>

          {}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <h4 className="text-sm font-medium mb-2">Legenda</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span>Ativo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span>Em Análise</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span>Contrato Encerrado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500 rounded-full" />
                <span>Inativo</span>
              </div>
            </div>
          </div>

          {}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-sm">
              <div className="font-medium">{providers.length} prestadores</div>
              <div className="text-muted-foreground">no mapa</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2 text-center">
          Clique nos marcadores para ver detalhes dos prestadores
        </p>
      </CardContent>
    </Card>
  )
}
