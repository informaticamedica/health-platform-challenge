import { useAuth } from "@/context/auth";
import { getConditionById } from "@/services/backend";
import { ConditionType } from "@/types/dto.type";
import { Button } from "@platform/design-system";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ConditionDetailPage() {
  const { session, signOut } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [condition, setCondition] = useState<ConditionType | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!session?.accessToken || !id) {
        navigate("/");
        return;
      }
      const response = await getConditionById(session.accessToken, id);
      if (response.error) {
        if (response.status === 401) {
          await signOut();
          navigate("/");
        }
        return;
      }
      setCondition(response.data);
    };

    load().catch((error: unknown) => {
      console.error("Error loading condition", error);
    });
  }, [id, navigate, session?.accessToken, signOut]);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-10 pt-28 sm:px-6 lg:px-8">
      <Button variant="outline" onClick={() => navigate("/conditions")}>Volver</Button>
      <div className="mt-4 rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Condition {condition?.id ?? ""}</h2>
        <p className="mt-2 text-sm">Code: {condition?.code ?? "-"}</p>
        <p className="text-sm">Clinical status: {condition?.clinical_status ?? "-"}</p>
        <p className="text-sm">Verification status: {condition?.verification_status ?? "-"}</p>
        <p className="text-sm">Notes: {condition?.notes ?? "-"}</p>
      </div>
    </div>
  );
}
