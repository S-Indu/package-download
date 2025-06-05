import {execa} from 'execa';
import path from 'path';
import fs from 'fs';
import chalk from 'chalk'
import Table from 'cli-table3';

const getInstalledPackages = async () => {
    const { stdout } = await execa('npm', ['list', '--depth=0', '--json']);
    return JSON.parse(stdout).dependencies;
  };
  
  const getProjectDependencies = () => {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    return {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };
  };
  
 
  const main = async () => {
    try {
      const installedPackages = await getInstalledPackages();
      const projectDependencies = getProjectDependencies();
  
      const dependencies = Object.keys(projectDependencies).map(pkg => {
        const specifiedVersion = projectDependencies[pkg];
        const installedVersion = installedPackages[pkg]?.version || 'Not installed';
        return { name: pkg, specifiedVersion, installedVersion };
      });
  
      const table = new Table({
        head: [chalk.cyanBright('Package'), chalk.cyan('Specified Version'), chalk.cyan('Installed Version')]
      });
  
      dependencies.forEach(dep => {
        table.push([dep.name, dep.specifiedVersion, dep.installedVersion]);
      });
  
      console.log(table.toString());
    } catch (error) {
      console.error('Error:', error.message);
    }
  };
  
  main();
  
