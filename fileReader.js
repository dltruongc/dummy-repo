const fs = require("fs");
const Path = require("path");
const { fileTypes, fileIcons } = require("./supportFile");

function convertSize(bytes) {
    if (bytes >= 1073741824) {
        bytes = (bytes / 1073741824).toFixed(0) + " GB";
    } else if (bytes >= 1048576) {
        bytes = (bytes / 1048576).toFixed(0) + " MB";
    } else if (bytes >= 1024) {
        bytes = (bytes / 1024).toFixed(0) + " KB";
    } else if (bytes > 1) {
        bytes = bytes + " bytes";
    } else if (bytes == 1) {
        bytes = bytes + " byte";
    } else {
        bytes = "-";
    }
    return bytes;
}

exports.load = (userRoot, location) => {
    return new Promise((resolve, reject) => {
        let files = fs.readdirSync(location);

        let result = [];

        files.forEach((file) => {
            let path = location + "/" + file;
            if (location.endsWith("/")) {
                path = location + file;
            }

            let stat = fs.statSync(path);
            let ext = Path.extname(file);
            let type = fileTypes[ext] || "Other File";
            let icon = fileIcons[ext] || "<i class='fas fa-file'></i>";
            let newPath = path.replace(userRoot, "");

            if (stat.isDirectory()) {
                if (newPath.startsWith("/")) {
                    newPath = `?dir=${newPath.substring(1)}`;
                } else {
                    newPath = `?dir=${newPath}`;
                }
            }

            result.push({
                name: file,
                path: path,
                isDirectory: stat.isDirectory(),
                size: convertSize(stat.size),
                lastModified: stat.mtime.toLocaleString(),
                ext: ext,
                type: type,
                icon: icon,
                newPath: newPath,
            });
        });

        result.sort((a, b) => {
            if (a.isDirectory && !b.isDirectory) {
                return -1;
            } else if (!a.isDirectory && b.isDirectory) {
                return 1;
            } else {
                return a.name.localeCompare(b.name);
            }
        });

        resolve(result);
    });
};