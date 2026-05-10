// app/(auth)/layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return (
	  <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
		<div style={{ maxWidth: '400px', width: '100%' }}>
		  {children}
		</div>
	  </div>
	);
  }