import Image from 'next/image';

const Logo = ({ width = 100, height = 100 }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Image src="/voxen-logo.png" alt="Logo" width={width} height={height} unoptimized />
    </div>
  );
};

export default Logo;