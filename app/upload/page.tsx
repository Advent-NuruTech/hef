"use client";
import UploadForm from "@/components/UploadForm";
// import withAuth from "@/components/withAuth";
import withAuth from "@/login/withAuth";

function UploadPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upload to HEF Gallery</h2>
      <UploadForm />
    </div>
  );
}

export default withAuth(UploadPage);