declare const __brand: unique symbol;

export type Brand<T, B extends string> = T & {
	readonly [__brand]?: B;
};

type ExtractBase<T> = T extends Brand<infer A, never> ? A : never;
type ExtractBrand<T> = T extends Brand<never, infer A> ? A : never;

export type ExtendBrand<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends Brand<any, string>,
	B extends string
> = Brand<ExtractBase<T>, `${B}:${ExtractBrand<T>}`>;

export type BrandedId<B extends string> = Brand<string, B>;

export type ExtendedBrandedID<
	T extends BrandedId<string>,
	B extends string,
> = ExtendBrand<T, B>;

export type Guid = BrandedId<"guid">;