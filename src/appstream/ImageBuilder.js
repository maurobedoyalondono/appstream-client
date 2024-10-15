const fs = require("fs");
const path = require("path");

// Function to generate Terraform for both Infrastructure and Image Builder
const generateInfrastructureFromConfig = (config) => {
  const templatePath = path.join(
    __dirname,
    "../infrastructure/templates/input/appstream/infrastructure_image_builder.tf"
  );

  // Read the Terraform template
  fs.readFile(templatePath, "utf8", (err, template) => {
    if (err) throw err;

    const infrastructureConfig = config.infrastructure;
    const builderConfig = config.appStreamBuilderImages[0];

    // Replace placeholders in the template with values from the config
    const terraform = template
      .replace(/{{region}}/g, infrastructureConfig.region)
      .replace(/{{vpc}}/g, infrastructureConfig.vpc)
      .replace(/{{subnet}}/g, infrastructureConfig.subnet)
      .replace(/{{security_group}}/g, infrastructureConfig.securityGroup)
      .replace(/{{builder_name}}/g, builderConfig.name)
      .replace(/{{instance_type}}/g, builderConfig.infrastructure.instanceType)
      .replace(
        /{{base_image}}/g,
        builderConfig.infrastructure.baseImage.replace("AWS\\", "")
      )
      .replace(
        /{{iam_role}}/g,
        builderConfig.infrastructure["iam-role"].replace(/-/g, "_")
      )
      .replace(/{{description}}/g, builderConfig.description)
      .replace(
        /{{default_internet_access}}/g,
        builderConfig.infrastructure.defaultInternetAccess.toString()
      );

      const outputPath = path.join(
        __dirname,
        `../infrastructure/templates/output/appstream/infrastructure_image_builder${ builderConfig.name }.tf`
      );

      // Write the final Terraform script to the output directory
      fs.writeFile(outputPath, terraform, "utf8", (err) => {
        if (err) throw err;
        console.log(
          "Infrastructure and Image Builder Terraform has been generated."
        );
      });
  });
};

module.exports = generateInfrastructureAndImageBuilder;
