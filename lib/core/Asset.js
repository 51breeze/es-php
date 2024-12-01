import {getAssetsManager, Asset as BaseAsset, isAsset} from "@easescript/transform/lib/core/Asset";
import Utils from "easescript/lib/core/Utils";
import path from "path";
import { createUniqueHashId } from "./Common";
class Asset extends BaseAsset{
    #initialized = false;

    initialize(ctx){
        if(this.#initialized)return;
        let outDir = ctx.getOutputDir();
        let publicDir = ctx.getPublicDir();
        let file = String(this.file).trim();
        let sourceFile = file;
        let filename = null;
        let folder = ctx.getSourceFileMappingFolder(file+'.assets')
        if(this.type==="style" && file.includes('?')){
            sourceFile = file.split('?')[0];
            filename = ctx.genUniFileName(file);
        }else{
            filename = path.basename(sourceFile);
        }
        if(folder){
            if(path.isAbsolute(folder)){
                this.outfile = Utils.normalizePath(path.join(folder, filename));
            }else{
                this.outfile = Utils.normalizePath(path.join(outDir, folder, filename));
            }
        }else{
            let relativeDir = ctx.plugin.complier.getRelativeWorkspace(sourceFile);
            if(relativeDir){
                relativeDir = path.dirname(relativeDir);
            }
            this.outfile = Utils.normalizePath(path.join(outDir, publicDir, relativeDir, filename));
        }
       
        const vm = ctx.getVModule("asset.Manifest");
        vm.append(ctx, createUniqueHashId(file),this.outfile)
    }

    async build(ctx){
        if(!this.changed)return;
        if(ctx.options.emitFile){
            ctx.emit(this)
        }
        this.changed = false;
    }
}

export {
    getAssetsManager,
    isAsset,
    Asset
}