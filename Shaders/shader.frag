#version 330 core

in vec4 vCol;
out vec4 colour;
in vec2 TexCoord;
in vec3 Normal;
in vec3 FragPos;

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec3 lightColor;
uniform vec3 lightPos;
uniform vec3 viewPos;

vec3 ambientLight(){
    float ambientStrength = 0.3f;  // Reduced from 0.8 to 0.1 for better shadows
    vec3 ambient = ambientStrength * lightColor;
    return ambient;
}

vec3 diffuseLight(){
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos); // Light position
    float diff = max(dot(norm, lightDir), 0.0);

    float diffuseStrength = 0.8f;  // Increased from 0.5 to 1.0 for better contrast
    vec3 diffuse = diffuseStrength * lightColor * diff;
    return diffuse;
}

vec3 specularLight(){
    float specularStrength = 0.5f;
    float shininess = 64.0f;
    vec3 lightDir = normalize(lightPos - FragPos);
    vec3 norm = normalize(Normal);
    vec3 reflectDir = reflect(-lightDir, norm);
    vec3 viewDir = normalize(viewPos - FragPos);
    // float spec = pow(max(dot(viewDir, reflectDir), 0.0f), shininess);

    // blinn-phong
    vec3 halfDir = normalize((lightDir + viewDir) / 2.0f);
    float spec = pow(max(dot(norm, halfDir), 0.0f), shininess);

    vec3 specular = lightColor * spec * specularStrength;
    return specular;
}

void main()
{
    // colour = vCol; // Color depends on the vertex position

    // Calculate all lighting components
    vec3 ambient = ambientLight();
    vec3 diffuse = diffuseLight();
    vec3 specular = specularLight();
    
    // Combine all lighting components
    // Phong Shading
    vec3 result = ambient + diffuse + specular;
    colour = texture(texture1, TexCoord) * vec4(result, 1.0);

    // vec4 texColor = texture(texture1, TexCoord);
    // vec4 texColor2 = texture(texture2, TexCoord);

    // colour = mix(texColor, texColor2, texColor2.a);
    // colour = texture(texture1, TexCoord) * vCol;
}