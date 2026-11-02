import React, { useState, useEffect } from 'react';
import { fetchSpecies } from '../services/api';
import { SpeciesDetail } from '../types';
import { Search, Filter, BookOpen, ExternalLink, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export const SpeciesDirectory: React.FC = () => {
  const [species, setSpecies] = useState<SpeciesDetail[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 18;

  const loadSpecies = async (p = 1, query = '', family = '') => {
    setIsLoading(true);
    try {
      const data = await fetchSpecies(p, pageSize, query, family);
      setSpecies(data.species);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      console.error('Error fetching species:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSpecies(1, searchQuery, selectedFamily);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadSpecies(1, searchQuery, selectedFamily);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      loadSpecies(newPage, searchQuery, selectedFamily);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const commonFamilies = [
    'All Families',
    'Accipitridae',
    'Anatidae',
    'Ardeidae',
    'Columbidae',
    'Corvidae',
    'Falconidae',
    'Fringillidae',
    'Laridae',
    'Paridae',
    'Passerellidae',
    'Picidae',
    'Strigidae',
    'Trochilidae',
    'Tyrannidae',
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="max-w-3xl mb-6">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            Global Avian Catalog
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Supported Avian Species ({total.toLocaleString()})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore the comprehensive catalog of 1,486 bird species recognized by the DINOv2 model, complete with Linnaean taxonomy.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by common name, scientific name, or genus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-48">
              <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedFamily}
                onChange={(e) => {
                  const val = e.target.value === 'All Families' ? '' : e.target.value;
                  setSelectedFamily(val);
                  loadSpecies(1, searchQuery, val);
                }}
                className="w-full pl-8 pr-8 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 appearance-none cursor-pointer"
              >
                {commonFamilies.map((fam) => (
                  <option key={fam} value={fam}>{fam}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Grid of Species Cards */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
          <p className="text-sm font-semibold">Loading Avian Species...</p>
        </div>
      ) : species.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <p className="font-bold text-slate-800 text-base mb-1">No bird species matched your search.</p>
          <p className="text-xs">Try searching for a genus name (e.g., "Buteo", "Corvus", "Larus") or clearing the family filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {species.map((sp) => {
            const inatUrl = sp.inaturalist_id 
              ? `https://www.inaturalist.org/taxa/${sp.inaturalist_id}`
              : `https://www.inaturalist.org/taxa/search?q=${encodeURIComponent(sp.scientific_name)}`;
            const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(sp.scientific_name.replace(' ', '_'))}`;

            return (
              <div
                key={sp.class_id}
                className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                    <span>ID #{sp.class_id}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">{sp.family}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {sp.common_name}
                  </h3>
                  <p className="text-xs text-slate-500 italic mb-3 font-medium">
                    {sp.scientific_name}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-600 font-medium">
                    Genus: <strong className="text-slate-800">{sp.genus}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={wikiUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-500 hover:text-emerald-700 p-1"
                      title="Read on Wikipedia"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={inatUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:text-emerald-900 font-bold text-[11px]"
                    >
                      iNaturalist
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between shadow-xs">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isLoading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <span className="text-xs font-medium text-slate-600">
            Page <strong className="text-slate-900">{page}</strong> of <strong className="text-slate-900">{totalPages}</strong>
          </span>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || isLoading}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
