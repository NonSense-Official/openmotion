# OpenMotion Roadmap & Architecture

This document outlines the strategic vision, architectural progression, and technical milestones for **OpenMotion** as it evolves from a high-fidelity web prototype into a production-grade, native desktop motion graphics workstation.

---

## Strategic Vision

OpenMotion is designed to bridge the gap between mobile motion design and professional desktop compositing. 

While the current web implementation provides an accessible, zero-install reference environment that mirrors authentic motion graphics workflows, the end goal is to deliver a **high-performance native desktop application written in Rust**.

```
┌─────────────────────────────────┐
│     Phase 1: Web Foundation     │  ◄── (Current Milestone)
│ WebGL + TypeScript/JS Prototype │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│    Phase 2: Rust Core Engine    │
│ WGPU + Rust Headless Compositor │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│  Phase 3: Native Desktop Studio │
│ Multi-Window + GPU Accelerated  │
└─────────────────────────────────┘
```

---

## Phased Roadmap

### Phase 1: Web Reference Foundation (Current)
- [x] Full WebGL compositing pipeline with real-time shader compilation.
- [x] High-fidelity layer model: Shapes, Text, Media (Images/Video), Null Objects, Audio.
- [x] Keyframing engine supporting complex cubic bezier curves (Ease-in, Ease-out, Bounce, Oscillate).
- [x] Authentic mobile editing controls: Move & Transform (3D position, rotation, skew, scale), Color/Fill, Border/Shadow, Blending & Opacity.
- [x] Real-time audio playback, timeline scrubbing, and bilateral VU meter.
- [x] Export pipeline utilizing WebCodecs hardware encoding with FFmpeg WASM fallback.

### Phase 2: Rust Core & GPU Compositor
The objective of Phase 2 is to decouple the business logic and rendering pipeline from the browser runtime into modular, reusable Rust crates.

- **`openmotion-core` (Rust):**
  - High-performance scene graph representation and keyframe timeline evaluation.
  - Native XML / AMFX serialization and deserialization.
  - Deterministic fixed-timestep simulation and animation caching.
- **`openmotion-render` (WGPU):**
  - Portable GPU backend targeting Vulkan, Metal, DirectX 12, and WebGPU.
  - GPU compute shaders for blurs, color correction, warps, and geometric distortions.
  - Multi-threaded frame evaluation for zero-latency preview playback.
- **`openmotion-audio` (Rust):**
  - Low-latency multi-track audio playback with real-time pitch correction and waveform visualization.

### Phase 3: Desktop-First Native Interface
Transitioning the UI from a single-column mobile touch paradigm into a full-fledged creative desktop workstation.

- **Dockable Workspace:** Configurable panels (Timeline, Viewer, Inspector, Asset Browser, Effect Library).
- **Pro Keyboard & Mouse Workflows:** Dedicated shortcut engine, multi-key modifiers, wheel zooming, and precision scrubbing.
- **Multi-Monitor & Multi-Window Support:** Detached preview displays and dedicated curve graph editors.
- **Native Hardware Encoding:** Direct integration with NVENC, Intel QuickSync, and Apple VideoToolbox for ultra-fast 4K/8K rendering.

---

## Architectural Comparison

| Dimension | Web Version (Phase 1) | Native Desktop (Phase 3) |
| :--- | :--- | :--- |
| **Language** | JavaScript / WebGL | Rust (Safe, zero-cost abstractions) |
| **Graphics API** | WebGL 2.0 | WGPU (Vulkan / Metal / DX12) |
| **Audio Processing** | Web Audio API | Native multi-track engine (CPAL / Symphonia) |
| **Memory Model** | V8 Garbage Collected | Manual / RAII with zero-copy buffer sharing |
| **UI Paradigm** | Mobile-touch layout | Multi-docking desktop workspace |
| **Export Engine** | WebCodecs + FFmpeg WASM | Hardware-accelerated native encoders |
| **Project Compatibility**| XML / AMFX Presets | XML / AMFX Presets (Lossless bidirectional) |

---

## How to Get Involved

We welcome developers, motion designers, and graphic programmers interested in Rust, systems engineering, and creative tools. 

Check our issue tracker for RFCs regarding the Rust core crate definitions and shader specifications.
