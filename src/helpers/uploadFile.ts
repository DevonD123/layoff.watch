import showMsg from "@h/msg";
import { supabase } from "@h/supabaseClient";
import { v4 as uuidv4 } from "uuid";

const uploadFile = async (
  bucket: "csuit-avatar" | "company-logo",
  file?: File
) => {
  if (!file) {
    return "";
  }
  const extn = file.type.replace(/(.*)\//g, "");
  const { data: upload, error: uploadErr } = await supabase.storage
    .from(bucket)
    .upload(`public/${uuidv4()}.${extn}`, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (uploadErr || !upload) {
    console.error("Error uploading");
    console.error(uploadErr, upload);
    showMsg("Error uploading file", "error");
    return "";
  }
  return upload.Key;
};

export default uploadFile;
