import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Toaster, toast } from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function App() {
  const [incidents, setIncidents] = useState([]);

  // 🔹 Load initial data
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("incidents")
        .select("*")
        .order("created_at", { ascending: false });

      setIncidents(data || []);
    };
    load();
  }, []);

  //  Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("incidents")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "incidents",
        },
        (payload) => {
          const row = payload.new;

          setIncidents((prev) => [row, ...prev]);

          if (row.threat_level === "HIGH") {
            toast.error(
              `🚨 HIGH THREAT at (${row.lat}, ${row.lng})`
            );
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Toaster />
      <h1>🌿 NATURE'S EYE</h1>

      {/* Upload box */}
      <div
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <p>📤 Upload Image (Demo)</p>
        <input type="file" />
      </div>

      {/* Map */}
      <MapContainer
        center={[17.385, 78.486]}
        zoom={5}
        style={{ height: "400px", width: "100%", marginBottom: "20px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {incidents.map((i) => (
          <Marker key={i.id} position={[i.lat, i.lng]}>
            <Popup>
              {i.species} - {i.threat_level}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Table */}
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Species</th>
            <th>Threat</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((i) => (
            <tr key={i.id}>
              <td>{i.species}</td>
              <td>{i.threat_level}</td>
              <td>
                {i.lat}, {i.lng}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;