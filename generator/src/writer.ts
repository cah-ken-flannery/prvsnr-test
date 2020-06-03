import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync
} from "fs";
import { dirname, basename } from "path";
import * as glob from "glob";
import * as _ from "lodash";
import { pathToFileURL } from "url";

class FileWriter {
  filesToDelete: Set<string>;

  constructor(
    sinkDir: string,
    overwrite: boolean,
    filePattern = "/**/*.tf",
    create = true
  ) {
    if (create && !existsSync(sinkDir)) {
      mkdirSync(sinkDir, { recursive: true });
    }

    // If sink diretory is not empty, require 'overwrite' parameter to be set.
    const files = this.listFiles(sinkDir, filePattern);
    if (!overwrite && files.length > 0) {
      throw new Error(
        `sink dir contains files and overwrite is not set to string 'true'.`
      );
    }


    this.filesToDelete = new Set(_.filter(files, (file) => {
      // Never delete the backend config.
      // If this is the only file present, Terraform will delete the datasets.
      return (basename(file) !== "backend.tf")
    }));
  }

  finish() {
    // Delete files that are missing from the new configs.
    this.filesToDelete.forEach((file: any) => {
      unlinkSync(file);
    });
  }

  listFiles(dir: string, filePattern: string): string[] {
    return glob.sync(dir + filePattern);
  }

  write(file: any, contents: string) {
    this.filesToDelete.delete(file);

    const dir = dirname(file);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    if (existsSync(file)) {
      this.filesToDelete.delete(file);
      const currentContents = readFileSync(file).toString();
      if (contents === currentContents) {
        // No changes to make.
        return;
      }
    }

    writeFileSync(file, contents, "utf8");
  }
}

export { FileWriter };
