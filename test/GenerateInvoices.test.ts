import GenerateInvoices from "../src/GenerateInvoices"


test('Deve gerar as notas fiscais', async () => {
  const generateInvoices = new GenerateInvoices()
  await generateInvoices.execute()
})
