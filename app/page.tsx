import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const products = await prisma.product.findMany()

  return (
    <main style={{padding: '40px', fontFamily: 'sans-serif'}}>
      <h1 style={{fontSize: '32px', marginBottom: '20px'}}>MEHDI STORE</h1>
      
      {products.length === 0 ? (
        <p>المتجر فارغ حاليا. زيد منتجات من /admin</p>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px'}}>
          {products.map((p) => (
            <div key={p.id} style={{border: '1px solid #ddd', padding: '16px', borderRadius: '8px'}}>
              <h2>{p.name}</h2>
              <p style={{color: 'green', fontWeight: 'bold'}}>{p.price} درهم</p>
              <p>{p.description}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
