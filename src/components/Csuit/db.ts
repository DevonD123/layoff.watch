import { useQuery } from "@tanstack/react-query";
import {
  handleVisibleGenericErr,
  handleVisibleGenericErrWithCount,
} from "@h/db/helper";
import showMsg from "@h/msg";
import { supabase } from "@h/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { getRangeValues } from "@h/pghelper";
import { ICSuitInput } from "./types";
import uploadFile from "@h/uploadFile";

export function useCSuitByCompanies(company_ids: string[]) {
  return useQuery(
    ["comapnies_csuit", { company_ids: company_ids.join(",") }],
    () =>
      supabase
        .from("csuit")
        .select()
        .eq("is_draft", false)
        .eq("deleted", false)
        .then(handleVisibleGenericErr),
    {
      enabled: company_ids && company_ids.length >= 1,
    }
  );
}
export function usePagedCsuit(page?: number) {
  return useQuery(
    ["csuit_paged", { page }],
    async () => {
      const range = getRangeValues(page || 1);
      const response = await supabase
        .from("csuit")
        .select(`*`, { count: "exact" })
        .eq("deleted", false)
        .order("created_at")
        .range(range[0], range[1]);
      return handleVisibleGenericErrWithCount(response);
    },
    { enabled: typeof page !== "undefined", keepPreviousData: true }
  );
}

export function useCSuitByCompany(company_id?: string) {
  return useQuery(
    ["company_csuit", { company_id }],
    () =>
      supabase
        .from("company_csuit")
        .select(`*, csuit(*)`)
        .eq("is_draft", false)
        .eq("company_id", company_id)
        .eq("deleted", false)
        .then(handleVisibleGenericErr),
    { enabled: !!company_id }
  );
}

const dataURLToBlob = function (dataURL: string) {
  const BASE64_MARKER = ";base64,";
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    const parts = dataURL.split(",");
    const contentType = parts[0].split(":")[1];
    const raw = parts[1];

    return new Blob([raw], { type: contentType });
  }

  const parts = dataURL.split(BASE64_MARKER);
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;

  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
};

function readFileAsync(file: File) {
  return new Promise<string>((resolve, reject) => {
    let reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        return resolve(reader.result);
      }
      console.error(typeof reader.result);
      reject("Not string");
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
function readDataUrlAsImageAsync(dataUrl: string) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const max_size = 544; // TODO : pull max size from a site config
      let width = image.width;
      let height = image.height;
      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);
      const res = canvas.toDataURL("image/jpeg");
      console.log(res);
      resolve(res);
    };

    image.onerror = reject;
    image.src = dataUrl;
  });
}

async function getSizedImage(file: File) {
  console.log("Starting file upload");
  const dataUrl = await readFileAsync(file);
  const imgRes = await readDataUrlAsImageAsync(dataUrl);
  const blob = dataURLToBlob(imgRes);
  console.log("file resize success");
  return blob;
}

export async function addCSuitAsDraft({
  name,
  bio,
  company_id,
  start,
  end,
  role,
  file,
}: ICSuitInput & { file?: File }) {
  const key = await uploadFile("csuit-avatar", file);

  const { data, error } = await supabase.from("csuit").insert({
    name,
    bio,
    img_url: key,
    is_draft: true,
  });

  if (error || !data || data.length <= 0) {
    console.error(error);
    showMsg("Error adding exec", "error");
    return null;
  }

  let { data: link, error: linkErr } = await supabase
    .from("csuit_role")
    .insert({
      company_id,
      csuit_id: data[0].id,
      start,
      end,
      role,
      is_draft: true,
    });

  if (linkErr || !link || link.length <= 0) {
    console.error(linkErr);
    showMsg("Error adding exec", "error");
    return null;
  }

  return { ...link[0], csuit: data[0] };
}

export function useCsuitById(csuit_id?: string) {
  return useQuery(
    ["useCsuitById", { csuit_id }],
    () =>
      supabase
        .from("csuit")
        .select(`*, csuit_role(*,company(*))`)
        .eq("id", csuit_id)
        .eq("deleted", false)
        .single()
        .then(handleVisibleGenericErr),
    { enabled: !!csuit_id }
  );
}

export function useAllCSuitSummary() {
  return useQuery(
    ["useAllCSuitSummary"],
    () =>
      supabase
        .from("csuit")
        .select(
          `id,name,img_url, csuit_role(id,role,end,company(id,name,ticker))`
        )
        .eq("deleted", false)
        .then(handleVisibleGenericErr),
    {}
  );
}
