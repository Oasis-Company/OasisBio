# 3D Character Model System

## Overview

The 3D Character Model system is a key feature of OasisBio that allows users to upload, manage, and display 3D models representing their identities. It provides a visual representation of the identity and enhances the overall presentation of the OasisBio profile.

## Supported Formats

### OBJ Format
- **Description**: Wavefront OBJ file format
- **Advantages**: Widely supported, simple structure, compatible with most 3D software
- **Limitations**: Does not support animations or advanced features
- **File Extension**: `.obj`

### MTL Format
- **Description**: Material library file for OBJ models
- **Purpose**: Defines materials, textures, and rendering properties
- **File Extension**: `.mtl`

### Texture Files
- **Description**: Image files used for textures
- **Supported Formats**: JPEG, PNG, GIF, BMP
- **Purpose**: Add details and realism to the 3D model

## Model Management

### Uploading Models
1. **Select File**: Choose an OBJ file from your device
2. **Add Materials**: Optional MTL file and texture files
3. **Preview**: View the model before uploading
4. **Name Model**: Provide a name for the model
5. **Set Properties**: Configure model settings and associations
6. **Upload**: Submit the model to the system

### Editing Models
- **Update Model**: Replace the OBJ file with a new version
- **Modify Materials**: Update MTL and texture files
- **Change Properties**: Update model name, description, and associations
- **Adjust Preview**: Set a new default view for the model

### Deleting Models
- **Remove Model**: Delete the model and all associated files
- **Confirmation**: Required before permanent deletion

## Model Properties

- **Name**: The name of the model
- **Description**: A brief description of the model
- **OBJ URL**: The storage location of the OBJ file
- **MTL URL**: The storage location of the MTL file (optional)
- **Preview Image**: A static image of the model for preview purposes
- **Related World**: World the model is associated with (optional)
- **Related Era**: Era the model is associated with (optional)
- **Version**: Version number of the model
- **Uploaded At**: Date and time the model was uploaded

## 3D Viewer

### Features
- **Rotation**: Rotate the model to view from different angles
- **Zoom**: Zoom in and out to examine details
- **Pan**: Move the model within the viewing area
- **Lighting**: Adjust lighting to highlight features
- **Background**: Toggle between black, white, or transparent background
- **Camera Presets**: Quick access to common viewing angles
- **Model Information**: Display model details and properties

### Implementation
- **Technology**: Three.js / React Three Fiber
- **Performance**: Optimized for web-based viewing
- **Compatibility**: Works across modern browsers
- **Loading**: Progressive loading for large models

## Era and World Binding

### Era Binding
- **Description**: Link models to specific time periods
- **Use Case**: Show how the identity's appearance changes over time
- **Example**: "Young Elara" vs "Elder Elara"

### World Binding
- **Description**: Link models to specific fictional worlds
- **Use Case**: Create world-specific appearances for the identity
- **Example**: "Elara in Cyberpunk World" vs "Elara in Fantasy World"

## Model Storage

### File Structure

```
models/
├── oasis-prime.obj          # Main model file
├── oasis-prime.mtl          # Material file
├── textures/                # Texture files
│   ├── skin.jpg
│   └── clothing.png
└── previews/                # Preview images
    └── oasis-prime.jpg
```

### Storage Options
- **Local Development**: Stored in the `public/models` directory
- **Production**: Stored in cloud storage (S3 / Cloudflare R2)
- **Access**: Secure access with appropriate permissions

## Model Optimization

### Best Practices
1. **File Size**: Keep models under 10MB for faster loading
2. **Polygon Count**: Optimize geometry for web viewing
3. **Textures**: Use compressed textures to reduce file size
4. **LOD (Level of Detail)**: Implement different detail levels for different viewing distances
5. **Caching**: Enable browser caching for frequently accessed models

### Optimization Techniques
- **Mesh Simplification**: Reduce polygon count while maintaining visual quality
- **Texture Compression**: Use appropriate image formats and compression levels
- **Asset Bundling**: Combine multiple assets into a single file
- **Lazy Loading**: Load models only when needed

## Preview Generation

### Automatic Preview
- **Process**: System automatically generates a preview image when a model is uploaded
- **Method**: Renders the model from a default angle
- **Format**: JPEG or PNG format
- **Resolution**: Optimized for web display

### Custom Preview
- **Process**: User can set a custom preview by adjusting the model view
- **Method**: Capture the current view in the 3D viewer
- **Options**: Adjust lighting and background before capturing

## Model Display

### Public Profile
- **Location**: Displayed in the 3D Model section of the public OasisBio page
- **Interaction**: Visitors can rotate, zoom, and examine the model
- **Controls**: Intuitive controls for model manipulation
- **Performance**: Optimized for smooth interaction

### Dashboard
- **Location**: Displayed in the Models section of the user dashboard
- **Management**: Options to edit, delete, or set as default
- **Preview**: Thumbnail previews of all models

## Model Templates

### Pre-built Models
- **Description**: Ready-to-use 3D models provided by the platform
- **Categories**: Human, fantasy, sci-fi, abstract
- **Customization**: Users can modify templates to fit their identity
- **Usage**: Ideal for users without 3D modeling experience

### Model Packs
- **Description**: Collections of related models
- **Examples**: "Fantasy Character Pack", "Sci-Fi Explorer Pack"
- **Benefits**: Consistent style across multiple models
- **Availability**: Free and premium options

## Best Practices

1. **File Size**: Keep models small for faster loading
2. **Quality**: Balance detail with performance
3. **Consistency**: Maintain consistent style across related models
4. **Naming**: Use clear, descriptive names for models
5. **Organization**: Group related models together

## Future Enhancements

- **Animation Support**: Add animated models with骨骼 rigs
- **Interactive Models**: Allow users to customize model features in real-time
- **Model Sharing**: Enable users to share models with others
- **AI Model Generation**: Generate 3D models from descriptions or images
- **Augmented Reality**: View models in AR using mobile devices
- **Model Marketplace**: Buy and sell custom models
