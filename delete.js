import inquirer from 'inquirer';
import { execa } from 'execa';
import gradient from 'gradient-string';
import chalk from 'chalk';
import chalkAnimation from 'chalk-animation';


const getPackages = async () => {
  const { stdout } = await execa('npm', ['list', '--depth=0', '--json']);
  const packages = JSON.parse(stdout).dependencies;
  return Object.keys(packages).map(pkg => ({
    name: `${pkg} (${packages[pkg].version})`,
    value: pkg
  }));
};

const deletePackages = async (packagesToDelete) => {
  await execa('npm', ['uninstall', ...packagesToDelete]);
  console.log(gradient.instagram('🗑️ Packages deleted successfully!'));
};

const main = async () => {
  try {

    const animation = chalkAnimation.neon('🔍 Fetching packages...'); 
    await new Promise(resolve => setTimeout(resolve, 2000));
    animation.stop();
    const packages = await getPackages();
    if (packages.length === 0) {
      console.log(chalk.red('🚫 No packages found.'));
      return;
    }
    const { selectedPackages } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'selectedPackages',
        message: chalk.rgb(66, 212, 252)('✅ Select packages to delete:'),
        choices: packages
      }
    ]);
    if (selectedPackages.length > 0) {
      await deletePackages(selectedPackages);
    } else {
      console.log(chalk.yellow('⚠️ No packages selected.'));
    }
  } catch (error) {
    console.error(chalk.red('❌ Error:', error.message));
  }
};

main();

