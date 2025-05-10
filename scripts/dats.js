export async function loadData(range) {
  const res = await fetch(`data/${range}.json`);
  return await res.json();
}
