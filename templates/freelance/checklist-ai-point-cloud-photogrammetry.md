# AI Point Cloud / Photogrammetry Diagnostic Checklist

Use for computer-vision leads asking for point clouds from photos or videos. Default offer is diagnostic/tool-selection first, not a full production build.

## Intake

- Confirm input source: phone photos, drone photos, video frames, LiDAR, depth camera or mixed media.
- Confirm expected output: `.ply`, `.las`, `.obj`, mesh, measurements, viewer, API or desktop app.
- Ask for sample count, resolution, overlap, lighting, lens type, EXIF/GPS availability and object/scene scale.
- Confirm whether the client needs local/offline processing or can use approved cloud photogrammetry services.
- Define acceptance criteria: reconstruction completeness, scale accuracy, export format, processing time and manual cleanup tolerance.

## Safe First Phase

1. Review sample image constraints and expected deliverable.
2. Compare open-source and paid tool paths: COLMAP/OpenMVG/Open3D, Meshroom, Metashape, Polycam/Luma-style services or custom Python pipeline.
3. Build or specify one no-secret proof with public/dummy images.
4. Deliver tool recommendation, risk list, estimate and phase-2 build plan.

## Risks

- Do not promise reliable reconstruction from low-overlap or low-quality image sets before testing.
- Do not ingest confidential site, face, license plate, facility or client-property images into third-party services without written approval.
- Keep API keys, cloud credentials, proprietary datasets and paid software licenses client-controlled.
- Separate AI enhancement from photogrammetry fundamentals; LLMs do not replace geometry, calibration and input-quality constraints.

## Proposal Angle

Start with a technical validation sprint: choose the right reconstruction path, test one representative sample, define export/accuracy criteria and only then quote the full app or automation layer.
