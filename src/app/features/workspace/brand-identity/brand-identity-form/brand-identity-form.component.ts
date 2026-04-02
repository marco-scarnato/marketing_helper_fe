import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import {
  BrandIdentity,
  BrandIdentityUpdate,
  CustomerProfile,
  LogoAsset,
  ToneOfVoice,
  VisualIdentity
} from '../../../../core/models/brand-identity.model';

@Component({
  selector: 'app-brand-identity-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './brand-identity-form.component.html',
  styleUrl: './brand-identity-form.component.scss'
})
export class BrandIdentityFormComponent implements OnInit, OnChanges {
  @Input() model: BrandIdentity | null = null;
  @Output() sectionFocused = new EventEmitter<string>();
  @Output() saveSection = new EventEmitter<{ section: string; payload: BrandIdentityUpdate }>();
  @Output() uploadLogo = new EventEmitter<File>();
  @Output() formDirty = new EventEmitter<boolean>();

  form = this.fb.group({
    business_description: ['', Validators.required],
    mission: [''],
    vision: [''],
    unique_value_proposition: [''],

    tone_of_voice: this.fb.group({
      style: [''],
      language: [''],
      do_say: this.fb.array<FormControl<string>>([]),
      dont_say: this.fb.array<FormControl<string>>([]),
    }),

    visual_identity: this.fb.group({
      color_palette: this.fb.array<FormControl<string>>([]),
      typography: [''],
      imagery_style: [''],
      logo_usage_notes: [''],
    }),

    target_audience: this.fb.group({
      demographics: [''],
      psychographics: [''],
      pain_points: this.fb.array<FormControl<string>>([]),
      goals: this.fb.array<FormControl<string>>([]),
      buying_triggers: this.fb.array<FormControl<string>>([]),
    }),

    competitors: this.fb.array<FormControl<string>>([]),
    differentiators: this.fb.array<FormControl<string>>([]),

    products_services: this.fb.array<FormControl<string>>([]),

    keywords_seo: this.fb.array<FormControl<string>>([]),

    approved_claims: this.fb.array<FormControl<string>>([]),
    restricted_topics: this.fb.array<FormControl<string>>([]),
    legal_notes: [''],

    cta_primary: [''],
    cta_secondary: [''],
    preferred_channels: this.fb.array<FormControl<string>>([]),
  });

  chipInputs: Record<string, string> = {};

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    if (this.model) {
      this.patchForm(this.model);
    }

    this.form.valueChanges.subscribe(() => this.formDirty.emit(this.form.dirty));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model'] && this.model) {
      this.patchForm(this.model);
    }
  }

  get logos(): LogoAsset[] {
    return this.model?.logos ?? [];
  }

  get doSayArray(): FormArray<FormControl<string>> {
    return this.form.get('tone_of_voice.do_say') as FormArray<FormControl<string>>;
  }

  get dontSayArray(): FormArray<FormControl<string>> {
    return this.form.get('tone_of_voice.dont_say') as FormArray<FormControl<string>>;
  }

  get colorPaletteArray(): FormArray<FormControl<string>> {
    return this.form.get('visual_identity.color_palette') as FormArray<FormControl<string>>;
  }

  get painPointsArray(): FormArray<FormControl<string>> {
    return this.form.get('target_audience.pain_points') as FormArray<FormControl<string>>;
  }

  get goalsArray(): FormArray<FormControl<string>> {
    return this.form.get('target_audience.goals') as FormArray<FormControl<string>>;
  }

  get buyingTriggersArray(): FormArray<FormControl<string>> {
    return this.form.get('target_audience.buying_triggers') as FormArray<FormControl<string>>;
  }

  get competitorsArray(): FormArray<FormControl<string>> {
    return this.form.get('competitors') as FormArray<FormControl<string>>;
  }

  get differentiatorsArray(): FormArray<FormControl<string>> {
    return this.form.get('differentiators') as FormArray<FormControl<string>>;
  }

  get productsArray(): FormArray<FormControl<string>> {
    return this.form.get('products_services') as FormArray<FormControl<string>>;
  }

  get keywordsArray(): FormArray<FormControl<string>> {
    return this.form.get('keywords_seo') as FormArray<FormControl<string>>;
  }

  get approvedClaimsArray(): FormArray<FormControl<string>> {
    return this.form.get('approved_claims') as FormArray<FormControl<string>>;
  }

  get restrictedTopicsArray(): FormArray<FormControl<string>> {
    return this.form.get('restricted_topics') as FormArray<FormControl<string>>;
  }

  get channelsArray(): FormArray<FormControl<string>> {
    return this.form.get('preferred_channels') as FormArray<FormControl<string>>;
  }

  onSectionOpen(section: string): void {
    this.sectionFocused.emit(section);
  }

  save(section: string): void {
    const payload = this.buildSectionPayload(section);
    this.saveSection.emit({ section, payload });
    this.form.markAsPristine();
    this.formDirty.emit(false);
  }

  onLogoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files.length > 0 ? input.files[0] : null;
    if (!file) {
      return;
    }

    this.uploadLogo.emit(file);
    input.value = '';
  }

  addChip(key: string, array: FormArray<FormControl<string>>): void {
    const value = (this.chipInputs[key] || '').trim();
    if (!value) {
      return;
    }

    array.push(this.fb.control(value, { nonNullable: true }));
    this.chipInputs[key] = '';
  }

  removeChip(index: number, array: FormArray<FormControl<string>>): void {
    array.removeAt(index);
  }

  private buildSectionPayload(section: string): BrandIdentityUpdate {
    const value = this.form.getRawValue();

    if (section === 'core') {
      return {
        business_description: value.business_description || '',
        mission: value.mission || '',
        vision: value.vision || '',
        unique_value_proposition: value.unique_value_proposition || '',
      };
    }

    if (section === 'tone_of_voice') {
      return {
        tone_of_voice: value.tone_of_voice as ToneOfVoice,
      };
    }

    if (section === 'visual_identity') {
      return {
        visual_identity: value.visual_identity as VisualIdentity,
      };
    }

    if (section === 'target_audience') {
      return {
        target_audience: value.target_audience as CustomerProfile,
      };
    }

    if (section === 'positioning') {
      return {
        competitors: value.competitors || [],
        differentiators: value.differentiators || [],
      };
    }

    if (section === 'products') {
      return {
        products_services: value.products_services || [],
      };
    }

    if (section === 'seo') {
      return {
        keywords_seo: value.keywords_seo || [],
      };
    }

    if (section === 'compliance') {
      return {
        approved_claims: value.approved_claims || [],
        restricted_topics: value.restricted_topics || [],
        legal_notes: value.legal_notes || '',
      };
    }

    return {
      cta_primary: value.cta_primary || '',
      cta_secondary: value.cta_secondary || '',
      preferred_channels: value.preferred_channels || [],
    };
  }

  private patchForm(model: BrandIdentity): void {
    this.form.patchValue({
      business_description: model.business_description,
      mission: model.mission,
      vision: model.vision,
      unique_value_proposition: model.unique_value_proposition,
      legal_notes: model.legal_notes,
      cta_primary: model.cta_primary,
      cta_secondary: model.cta_secondary,
      tone_of_voice: {
        style: model.tone_of_voice?.style ?? '',
        language: model.tone_of_voice?.language ?? '',
      },
      visual_identity: {
        typography: model.visual_identity?.typography ?? '',
        imagery_style: model.visual_identity?.imagery_style ?? '',
        logo_usage_notes: model.visual_identity?.logo_usage_notes ?? '',
      },
      target_audience: {
        demographics: model.target_audience?.demographics ?? '',
        psychographics: model.target_audience?.psychographics ?? '',
      },
    });

    this.replaceArray(this.doSayArray, model.tone_of_voice?.do_say ?? []);
    this.replaceArray(this.dontSayArray, model.tone_of_voice?.dont_say ?? []);
    this.replaceArray(this.colorPaletteArray, model.visual_identity?.color_palette ?? []);

    this.replaceArray(this.painPointsArray, model.target_audience?.pain_points ?? []);
    this.replaceArray(this.goalsArray, model.target_audience?.goals ?? []);
    this.replaceArray(this.buyingTriggersArray, model.target_audience?.buying_triggers ?? []);

    this.replaceArray(this.competitorsArray, model.competitors ?? []);
    this.replaceArray(this.differentiatorsArray, model.differentiators ?? []);
    this.replaceArray(this.productsArray, model.products_services ?? []);
    this.replaceArray(this.keywordsArray, model.keywords_seo ?? []);
    this.replaceArray(this.approvedClaimsArray, model.approved_claims ?? []);
    this.replaceArray(this.restrictedTopicsArray, model.restricted_topics ?? []);
    this.replaceArray(this.channelsArray, model.preferred_channels ?? []);

    this.form.markAsPristine();
  }

  private replaceArray(array: FormArray<FormControl<string>>, values: string[]): void {
    while (array.length > 0) {
      array.removeAt(0);
    }

    values.forEach((value) => array.push(this.fb.control(value, { nonNullable: true })));
  }
}
