export default function FormulaChainReasoningApp() {
  const { useState } = React;

  const [variables, setVariables] = useState([]);

  const [links, setLinks] = useState([]);

  const [newVariable, setNewVariable] = useState("");
  const [newValue, setNewValue] = useState(0);

  const [newLink, setNewLink] = useState({
    from: "",
    to: "",
    multiplier: 1,
    explanation: "",
  });

  const variableMap = {};

  variables.forEach((v) => {
    variableMap[v.name] = Number(v.value);
  });

  const results = { ...variableMap };
  const reasoning = [];

  for (const link of links) {
    const fromValue = results[link.from] ?? 0;
    const contribution = fromValue * Number(link.multiplier);

    if (!results[link.to]) {
      results[link.to] = 0;
    }

    results[link.to] += contribution;

    reasoning.push({
      ...link,
      fromValue,
      contribution,
      total: results[link.to],
    });
  }

  function addVariable() {
    if (!newVariable.trim()) return;

    setVariables([
      ...variables,
      {
        id: Date.now(),
        name: newVariable.trim(),
        value: Number(newValue),
      },
    ]);

    setNewVariable("");
    setNewValue(0);
  }

  function updateVariable(id, field, value) {
    setVariables(
      variables.map((v) =>
        v.id === id ? { ...v, [field]: field === "value" ? Number(value) : value } : v
      )
    );
  }

  function deleteVariable(id) {
    const variable = variables.find((v) => v.id === id);

    setVariables(variables.filter((v) => v.id !== id));

    if (variable) {
      setLinks(
        links.filter(
          (l) => l.from !== variable.name && l.to !== variable.name
        )
      );
    }
  }

  function addLink() {
    if (!newLink.from || !newLink.to) return;

    setLinks([
      ...links,
      {
        id: Date.now(),
        ...newLink,
        multiplier: Number(newLink.multiplier),
      },
    ]);

    setNewLink({
      from: "",
      to: "",
      multiplier: 1,
      explanation: "",
    });
  }

  function deleteLink(id) {
    setLinks(links.filter((l) => l.id !== id));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Formula Chain Builder
          </h1>
          <p className="text-slate-300 max-w-3xl">
            Create completely custom reasoning systems. Define any variables,
            outputs, and relationships you want — the app does not rely on any
            predefined economics or science variables. You build the entire
            model yourself.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4">Variables</h2>

            <div className="space-y-4 mb-6">
              {variables.map((variable) => (
                <div
                  key={variable.id}
                  className="grid grid-cols-[1fr_120px_80px] gap-3 items-center"
                >
                  <input
                    value={variable.name}
                    onChange={(e) =>
                      updateVariable(variable.id, "name", e.target.value)
                    }
                    className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
                  />

                  <input
                    type="number"
                    value={variable.value}
                    onChange={(e) =>
                      updateVariable(variable.id, "value", e.target.value)
                    }
                    className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
                  />

                  <button
                    onClick={() => deleteVariable(variable.id)}
                    className="bg-red-600 hover:bg-red-500 rounded-xl py-3 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h3 className="text-lg font-medium mb-3">Add Variable</h3>

              <div className="grid md:grid-cols-3 gap-3">
                <input
                  placeholder="Variable name"
                  value={newVariable}
                  onChange={(e) => setNewVariable(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
                />

                <input
                  type="number"
                  placeholder="Initial value"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
                />

                <button
                  onClick={addVariable}
                  className="bg-blue-600 hover:bg-blue-500 rounded-xl px-4 py-3 font-medium transition"
                >
                  Add Variable
                </button>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-4">Relationships</h2>

            <div className="space-y-4 mb-6 max-h-[420px] overflow-y-auto pr-2">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="bg-slate-800 rounded-2xl p-4 border border-slate-700"
                >
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <div className="font-semibold text-lg">
                        {link.from} → {link.to}
                      </div>

                      <div className="text-slate-300 text-sm mt-1">
                        Multiplier: {link.multiplier}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteLink(link.id)}
                      className="bg-red-600 hover:bg-red-500 rounded-xl px-3 py-2 transition"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="text-slate-300 text-sm">
                    {link.explanation || "No explanation provided."}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-6 space-y-3">
              <h3 className="text-lg font-medium">Add Relationship</h3>

              <div className="grid md:grid-cols-2 gap-3">
                <select
                  value={newLink.from}
                  onChange={(e) =>
                    setNewLink({ ...newLink, from: e.target.value })
                  }
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
                >
                  <option value="">From Variable</option>

                  {variables.map((v) => (
                    <option key={v.id} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Output variable"
                  value={newLink.to}
                  onChange={(e) =>
                    setNewLink({ ...newLink, to: e.target.value })
                  }
                  className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
                />
              </div>

              <input
                type="number"
                step="0.1"
                placeholder="Multiplier"
                value={newLink.multiplier}
                onChange={(e) =>
                  setNewLink({
                    ...newLink,
                    multiplier: e.target.value,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none"
              />

              <textarea
                placeholder="Explain the reasoning behind this relationship"
                value={newLink.explanation}
                onChange={(e) =>
                  setNewLink({
                    ...newLink,
                    explanation: e.target.value,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none min-h-[110px]"
              />

              <button
                onClick={addLink}
                className="w-full bg-emerald-600 hover:bg-emerald-500 rounded-xl px-4 py-3 font-medium transition"
              >
                Add Relationship
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-5">Calculated Outputs</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(results).map(([name, value]) => (
              <div
                key={name}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
              >
                <div className="text-slate-300 text-sm mb-2">Variable</div>
                <div className="text-xl font-semibold">{name}</div>
                <div className="text-3xl font-bold mt-3">
                  {Number(value).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-5">
            Chain of Reasoning
          </h2>

          <div className="space-y-4">
            {reasoning.map((step, index) => (
              <div
                key={step.id}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  <div className="font-semibold text-lg">
                    {step.from} → {step.to}
                  </div>
                </div>

                <div className="space-y-2 text-slate-200">
                  <p>
                    Starting value from <strong>{step.from}</strong>: {" "}
                    {step.fromValue.toFixed(2)}
                  </p>

                  <p>
                    Apply multiplier <strong>{step.multiplier}</strong>
                  </p>

                  <p>
                    Contribution added to <strong>{step.to}</strong>: {" "}
                    {step.contribution.toFixed(2)}
                  </p>

                  <p>
                    Running total for <strong>{step.to}</strong>: {" "}
                    {step.total.toFixed(2)}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700 text-slate-300">
                  {step.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>

          <div className="space-y-3 text-slate-300 leading-relaxed">
            <p>
              The system starts completely empty.
            </p>

            <p>
              Users create their own variables, assign values, and define how
              variables influence one another.
            </p>

            <p>
              Relationships can represent economics, physics, business models,
              ecosystems, politics, engineering systems, or any other chain of
              reasoning.
            </p>

            <p>
              Each relationship has:
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>A source variable</li>
              <li>A destination variable</li>
              <li>A multiplier/effect strength</li>
              <li>A written explanation</li>
            </ul>

            <p>
              The output section then shows all calculated values together with
              a detailed explanation of how every result was produced.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
