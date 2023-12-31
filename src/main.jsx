import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import './index.css'

const pexel = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260`;

const images = [
  // Front
  { position: [0, 0, 1.5], rotation: [0, 0, 0], name: "Monalisa", url: "./monalisa-760x1260.jpg" },
  // Back
  { position: [-0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(416430) },
  { position: [0.8, 0, -0.6], rotation: [0, 0, 0], url: pexel(310452) },
  // Left
  { position: [-1.75, 0, 0.25], rotation: [0, Math.PI / 2.5, 0], url: pexel(327482) },
  { position: [-2.15, 0, 1.5], rotation: [0, Math.PI / 2.5, 0], url: pexel(325185) },
  { position: [-2, 0, 2.75], rotation: [0, Math.PI / 2.5, 0], name: "Starry Night", url: "./noite-estrelada-750x1260.jpg" },
  // Right
  { position: [1.75, 0, 0.25], rotation: [0, -Math.PI / 2.5, 0], name: "The Scream", url: "./o-grito-750x1260.jpg" },
  { position: [2.15, 0, 1.5], rotation: [0, -Math.PI / 2.5, 0], url: pexel(911738) },
  { position: [2, 0, 2.75], rotation: [0, -Math.PI / 2.5, 0], url: pexel(1738986) }
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App images={images} />
  </React.StrictMode>,
)