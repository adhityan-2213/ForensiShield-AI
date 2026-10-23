import AIChat from "../components/AIChat";
import DashboardLayout from "../layouts/DashboardLayout";

function AIAssistant() {
  return (
    <DashboardLayout>
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white">AI Assistant</h2>
          <p className="mt-2 text-slate-400">Your AI-powered cybersecurity and digital forensics assistant.</p>
        </div>
        <AIChat />
      </section>
    </DashboardLayout>
  );
}

export default AIAssistant;