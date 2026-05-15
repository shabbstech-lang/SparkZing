import { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'motion/react';
import { ShoppingCart, Heart, Share2, Star, ChevronLeft, Sparkles, Coffee, ShieldCheck, Leaf, AlertCircle, Home, ChevronRight } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { Product } from '@/types';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { useCart } from '@/contexts/CartContext';

export function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProductData = async () => {
      setLoading(true);
      setError(null);
      try {
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = { id: productSnap.id, ...productSnap.data() } as Product;
          setProduct(productData);

          // Fetch similar products in same category
          const similarQuery = query(
            collection(db, 'products'),
            where('category', '==', productData.category),
            where('status', '==', 'Active'),
            limit(5)
          );
          const similarSnap = await getDocs(similarQuery);
          const similarList = similarSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Product))
            .filter(p => p.id !== id);
          setSimilarProducts(similarList);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `products/${id}`);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
        <div className="w-12 h-12 border-4 border-spark-orange/20 border-t-spark-orange rounded-full animate-spin" />
        <p className="text-sm font-black text-deep-charcoal italic tracking-tight uppercase">Sourcing Batch...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-6 bg-white px-6">
        <AlertCircle className="w-16 h-16 text-chili opacity-20" />
        <div className="text-center">
          <h2 className="text-2xl font-black text-deep-charcoal italic">{error || 'Something went wrong'}</h2>
          <p className="text-sm text-cinnamon/60 font-bold uppercase tracking-widest mt-2 px-12">We couldn't find the authentic crunch you were looking for.</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="px-10 py-4 bg-deep-charcoal text-white rounded-[2rem] font-black italic shadow-xl hover:bg-chili transition-all"
        >
          BACK TO STORE
        </button>
      </div>
    );
  }

  // Use product image or placeholder images if not available
  const productImages = [product.image];

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Product Header (Mobile Nav) */}
      <div className="px-6 py-4 flex items-center justify-between lg:hidden border-b border-orange-50 bg-white sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs font-black text-cinnamon uppercase tracking-widest">
           <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <Sparkles className="w-5 h-5 text-saffron" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 pt-8">
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cinnamon/40">
          <Link to="/" className="p-1.5 hover:bg-cream rounded-lg transition-colors text-cinnamon">
            <Home className="w-3.5 h-3.5" />
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/" className="hover:text-chili transition-colors">Store</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-cinnamon/60">{product.category}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-deep-charcoal">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:flex lg:gap-12 lg:py-8">
        {/* Left: Gallery (Single Image) */}
        <div className="relative group overflow-hidden rounded-[3rem] bg-cream aspect-[4/5] lg:aspect-square lg:w-1/2 max-w-[600px] mb-8 lg:mb-0">
          <m.img
            src={product.image}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full object-cover"
            alt={product.name}
          />
          
          <div className="absolute top-6 right-6 flex flex-col gap-3">
             <button 
               onClick={() => setIsLiked(!isLiked)}
               className={cn(
                 "p-4 rounded-2xl backdrop-blur-xl shadow-xl transition-all",
                 isLiked ? "bg-chili text-white" : "bg-white/80 text-cinnamon hover:bg-white"
               )}
             >
                <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
             </button>
             <button className="p-4 bg-white/80 backdrop-blur-xl text-cinnamon rounded-2xl shadow-xl hover:bg-white transition-all">
                <Share2 className="w-5 h-5" />
             </button>
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:flex-1 lg:max-w-[500px]">
             <div className="flex items-center gap-2 mb-4">
                <div className="flex text-turmeric">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-turmeric" />)}
                </div>
                <span className="text-xs font-black text-cinnamon/60 uppercase tracking-widest">Special Selection</span>
             </div>

             <div className="space-y-2 mb-8">
                <span className="text-xs font-black text-spark-orange uppercase tracking-[0.3em]">{product.category}</span>
                <h1 className="text-5xl md:text-6xl font-black text-deep-charcoal italic leading-none tracking-tight">
                   {product.name}
                </h1>
                <div className="flex items-center gap-4 mt-4">
                   <p className="text-3xl font-black text-cinnamon">Rs. {product.price}</p>
                   {product.isSeasonal && (
                     <span className="bg-saffron text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                        Limited Batch
                     </span>
                   )}
                </div>
             </div>

             <p className="text-lg text-cinnamon/80 font-medium leading-relaxed mb-10">
               {product.description || 'Authentic handmade snack crafted with heritage recipes and sun-dried ingredients for that legendary Spark Zing crunch.'}
             </p>

             {/* Features */}
             <div className="grid grid-cols-3 gap-4 mb-12">
                {[
                  { icon: Leaf, label: 'Plant Based' },
                  { icon: Coffee, label: 'Artisanal' },
                  { icon: ShieldCheck, label: 'Zero Presv.' },
                ].map((feat, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-4 bg-orange-50/50 rounded-2xl text-center">
                    <feat.icon className="w-5 h-5 text-saffron" />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-cinnamon">{feat.label}</span>
                  </div>
                ))}
             </div>

             {/* Details Accordion style */}
             <div className="space-y-8 mb-12">
                <div>
                   <h3 className="text-xs font-black text-deep-charcoal uppercase tracking-widest mb-4">Crunch Stats</h3>
                   <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-cream rounded-full text-xs font-bold text-cinnamon/80">Small Batch</span>
                      <span className="px-4 py-2 bg-cream rounded-full text-xs font-bold text-cinnamon/80">Hand-grinded</span>
                      <span className="px-4 py-2 bg-cream rounded-full text-xs font-bold text-cinnamon/80">Kerala Spices</span>
                   </div>
                </div>

                <div>
                   <h3 className="text-xs font-black text-deep-charcoal uppercase tracking-widest mb-4">Nutritional Focus</h3>
                   <div className="grid grid-cols-4 gap-4">
                      {[
                        { key: 'energy', val: 'Low' },
                        { key: 'fiber', val: 'High' },
                        { key: 'sugar', val: '0g' },
                        { key: 'love', val: '100%' },
                      ].map((stat) => (
                        <div key={stat.key} className="p-3 border-2 border-orange-50 rounded-2xl flex flex-col items-center">
                          <span className="text-xs font-black text-deep-charcoal">{stat.val}</span>
                          <span className="text-[8px] font-bold text-cinnamon uppercase opacity-60">{stat.key}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Similar Products */}
             {similarProducts.length > 0 && (
               <div className="pt-12 border-t border-orange-100 mb-12">
                  <h3 className="text-xs font-black text-deep-charcoal uppercase tracking-widest mb-6">Similar Delights</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                     {similarProducts.map(p => (
                       <Link 
                         to={`/product/${p.id}`} 
                         key={p.id} 
                         className="min-w-[180px] bg-cream rounded-[2.5rem] p-4 flex flex-col gap-3 group hover:scale-105 transition-all"
                       >
                          <div className="aspect-square rounded-2xl overflow-hidden bg-white">
                             <OptimizedImage src={p.image} alt={p.name} className="w-full h-full" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-deep-charcoal italic group-hover:text-chili transition-colors truncate">{p.name}</p>
                            <p className="text-[10px] font-bold text-cinnamon/60">Rs. {p.price}</p>
                          </div>
                       </Link>
                     ))}
                  </div>
               </div>
             )}
          </div>
        </div>

      {/* Floating Add to Cart */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent z-40">
         <div className="max-w-7xl mx-auto flex justify-center">
           <button 
             onClick={() => product && addToCart(product)}
             className="w-full max-w-md bg-deep-charcoal text-white py-5 rounded-[2rem] font-black italic flex items-center justify-center gap-4 shadow-2xl hover:bg-chili transition-all"
           >
              <ShoppingCart className="w-5 h-5" />
              ADD TO ZING BAG — Rs. {product.price}
           </button>
         </div>
      </div>
    </div>
  );
}

