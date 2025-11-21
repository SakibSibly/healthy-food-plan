"""
AI Consumption Pattern Analyzer
Analyzes user food consumption patterns and provides insights
"""
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict, List, Any
import statistics


class ConsumptionAnalyzer:
    """Analyzes food consumption patterns and generates insights."""
    
    # Recommended daily servings by category (general guidelines)
    RECOMMENDED_SERVINGS = {
        'fruit': 2.0,
        'vegetable': 3.0,
        'grain': 6.0,
        'protein': 2.0,
        'dairy': 3.0
    }
    
    # Waste prediction thresholds (days)
    WASTE_WARNING_DAYS = 3
    WASTE_CRITICAL_DAYS = 7
    
    def __init__(self, food_logs: List[Dict], inventory_items: List[Dict]):
        """
        Initialize analyzer with user data.
        
        Args:
            food_logs: List of food log dictionaries
            inventory_items: List of inventory item dictionaries
        """
        self.food_logs = food_logs
        self.inventory_items = inventory_items
        self.today = datetime.now().date()
    
    def analyze_all(self) -> Dict[str, Any]:
        """Run complete analysis and return insights."""
        return {
            'weekly_trends': self.analyze_weekly_trends(),
            'consumption_patterns': self.analyze_consumption_patterns(),
            'waste_predictions': self.predict_waste_items(),
            'balance_check': self.check_dietary_balance(),
            'heatmap_data': self.generate_heatmap_data(),
            'summary': self.generate_summary(),
            'generated_at': datetime.now().isoformat()
        }
    
    def analyze_weekly_trends(self) -> Dict[str, Any]:
        """Analyze consumption trends over the past week."""
        # Group logs by day of week
        day_consumption = defaultdict(lambda: defaultdict(float))
        
        for log in self.food_logs:
            try:
                log_date = datetime.fromisoformat(log.get('created_at', log.get('consumed_at', '')))
                day_name = log_date.strftime('%A')
                category = log.get('category', 'other')
                quantity = float(log.get('quantity', 0))
                
                day_consumption[day_name][category] += quantity
            except (ValueError, TypeError):
                continue
        
        # Find peak consumption days
        total_by_day = {day: sum(cats.values()) for day, cats in day_consumption.items()}
        avg_consumption = statistics.mean(total_by_day.values()) if total_by_day else 0
        
        # Identify patterns
        patterns = []
        for day, total in total_by_day.items():
            if total > avg_consumption * 1.3:
                patterns.append({
                    'day': day,
                    'type': 'high_consumption',
                    'total': round(total, 2),
                    'message': f'High consumption on {day}s ({round(total, 2)} items)'
                })
        
        # Category trends by day
        category_trends = {}
        for day, categories in day_consumption.items():
            category_trends[day] = {cat: round(qty, 2) for cat, qty in categories.items()}
        
        return {
            'daily_consumption': dict(total_by_day),
            'average_daily': round(avg_consumption, 2),
            'patterns': patterns,
            'category_by_day': category_trends
        }
    
    def analyze_consumption_patterns(self) -> Dict[str, Any]:
        """Detect over-consumption or under-consumption patterns."""
        # Calculate consumption by category over last 7 days
        category_consumption = defaultdict(float)
        category_count = defaultdict(int)
        
        cutoff_date = self.today - timedelta(days=7)
        
        for log in self.food_logs:
            try:
                log_date = datetime.fromisoformat(log.get('created_at', log.get('consumed_at', ''))).date()
                if log_date >= cutoff_date:
                    category = log.get('category', 'other')
                    quantity = float(log.get('quantity', 0))
                    category_consumption[category] += quantity
                    category_count[category] += 1
            except (ValueError, TypeError):
                continue
        
        # Calculate daily averages
        days_analyzed = min(7, (self.today - cutoff_date).days + 1)
        daily_avg = {cat: qty / days_analyzed for cat, qty in category_consumption.items()}
        
        # Compare with recommendations
        patterns = []
        for category, recommended in self.RECOMMENDED_SERVINGS.items():
            actual = daily_avg.get(category, 0)
            diff_percentage = ((actual - recommended) / recommended * 100) if recommended > 0 else 0
            
            if actual < recommended * 0.5:
                patterns.append({
                    'category': category,
                    'type': 'under_consumption',
                    'actual': round(actual, 2),
                    'recommended': recommended,
                    'difference': round(diff_percentage, 1),
                    'severity': 'high' if actual < recommended * 0.3 else 'medium',
                    'message': f'Low {category} intake: {round(actual, 2)} vs recommended {recommended}'
                })
            elif actual > recommended * 1.5:
                patterns.append({
                    'category': category,
                    'type': 'over_consumption',
                    'actual': round(actual, 2),
                    'recommended': recommended,
                    'difference': round(diff_percentage, 1),
                    'severity': 'medium' if actual < recommended * 2 else 'high',
                    'message': f'High {category} intake: {round(actual, 2)} vs recommended {recommended}'
                })
        
        return {
            'category_averages': {k: round(v, 2) for k, v in daily_avg.items()},
            'recommendations': self.RECOMMENDED_SERVINGS,
            'patterns': patterns,
            'total_items_logged': len(self.food_logs)
        }
    
    def predict_waste_items(self) -> Dict[str, Any]:
        """Predict items likely to be wasted based on expiration and usage patterns."""
        waste_predictions = []
        
        for item in self.inventory_items:
            try:
                expiration_str = item.get('expiration_date')
                if not expiration_str:
                    continue
                
                exp_date = datetime.fromisoformat(expiration_str.split('T')[0]).date()
                days_until_expiry = (exp_date - self.today).days
                
                # Check if item is expiring soon
                if 0 <= days_until_expiry <= self.WASTE_CRITICAL_DAYS:
                    # Calculate usage velocity (items per day)
                    category = item.get('category', 'other')
                    item_name = item.get('name', 'Unknown')
                    quantity = float(item.get('quantity', 0))
                    
                    # Count recent usage of similar items
                    recent_logs = [
                        log for log in self.food_logs
                        if log.get('category') == category
                        and (self.today - datetime.fromisoformat(
                            log.get('created_at', log.get('consumed_at', ''))
                        ).date()).days <= 7
                    ]
                    
                    usage_rate = len(recent_logs) / 7 if recent_logs else 0
                    estimated_days_to_consume = quantity / usage_rate if usage_rate > 0 else 999
                    
                    # Predict waste likelihood
                    waste_risk = 'low'
                    if estimated_days_to_consume > days_until_expiry:
                        if days_until_expiry <= self.WASTE_WARNING_DAYS:
                            waste_risk = 'critical'
                        else:
                            waste_risk = 'high'
                    elif days_until_expiry <= self.WASTE_WARNING_DAYS:
                        waste_risk = 'medium'
                    
                    if waste_risk in ['high', 'critical', 'medium']:
                        waste_predictions.append({
                            'item_id': item.get('id'),
                            'name': item_name,
                            'category': category,
                            'quantity': quantity,
                            'days_until_expiry': days_until_expiry,
                            'expiration_date': expiration_str,
                            'waste_risk': waste_risk,
                            'usage_rate': round(usage_rate, 2),
                            'estimated_days_to_consume': round(estimated_days_to_consume, 1),
                            'recommendation': self._generate_waste_recommendation(
                                item_name, days_until_expiry, waste_risk
                            )
                        })
            except (ValueError, TypeError):
                continue
        
        # Sort by risk level
        risk_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        waste_predictions.sort(key=lambda x: (risk_order[x['waste_risk']], x['days_until_expiry']))
        
        return {
            'predictions': waste_predictions,
            'total_at_risk': len(waste_predictions),
            'critical_count': len([p for p in waste_predictions if p['waste_risk'] == 'critical']),
            'high_risk_count': len([p for p in waste_predictions if p['waste_risk'] == 'high'])
        }
    
    def check_dietary_balance(self) -> Dict[str, Any]:
        """Check for imbalanced dietary patterns."""
        # Analyze last 7 days
        category_consumption = defaultdict(float)
        
        cutoff_date = self.today - timedelta(days=7)
        
        for log in self.food_logs:
            try:
                log_date = datetime.fromisoformat(log.get('created_at', log.get('consumed_at', ''))).date()
                if log_date >= cutoff_date:
                    category = log.get('category', 'other')
                    quantity = float(log.get('quantity', 0))
                    category_consumption[category] += quantity
            except (ValueError, TypeError):
                continue
        
        total_consumption = sum(category_consumption.values())
        if total_consumption == 0:
            return {
                'balanced': False,
                'message': 'Insufficient data for balance analysis',
                'flags': []
            }
        
        # Calculate percentages
        category_percentages = {
            cat: (qty / total_consumption * 100) for cat, qty in category_consumption.items()
        }
        
        # Check for imbalances
        flags = []
        
        # Low vegetables check
        veg_percent = category_percentages.get('vegetable', 0)
        if veg_percent < 15:
            flags.append({
                'type': 'low_vegetables',
                'severity': 'high' if veg_percent < 10 else 'medium',
                'percentage': round(veg_percent, 1),
                'message': f'Low vegetable consumption: {round(veg_percent, 1)}% of diet'
            })
        
        # Low fruits check
        fruit_percent = category_percentages.get('fruit', 0)
        if fruit_percent < 10:
            flags.append({
                'type': 'low_fruits',
                'severity': 'medium',
                'percentage': round(fruit_percent, 1),
                'message': f'Low fruit consumption: {round(fruit_percent, 1)}% of diet'
            })
        
        # High protein/meat check
        protein_percent = category_percentages.get('protein', 0)
        if protein_percent > 40:
            flags.append({
                'type': 'high_protein',
                'severity': 'medium',
                'percentage': round(protein_percent, 1),
                'message': f'High protein consumption: {round(protein_percent, 1)}% of diet'
            })
        
        # High grain/carbs check
        grain_percent = category_percentages.get('grain', 0)
        if grain_percent > 45:
            flags.append({
                'type': 'high_grains',
                'severity': 'low',
                'percentage': round(grain_percent, 1),
                'message': f'High grain consumption: {round(grain_percent, 1)}% of diet'
            })
        
        return {
            'balanced': len(flags) == 0,
            'category_distribution': {k: round(v, 1) for k, v in category_percentages.items()},
            'flags': flags,
            'total_items': int(total_consumption)
        }
    
    def generate_heatmap_data(self) -> Dict[str, Any]:
        """Generate heatmap-style data for visualization."""
        # Create 7-day x category matrix
        heatmap = []
        categories = list(self.RECOMMENDED_SERVINGS.keys())
        
        for i in range(7):
            day_date = self.today - timedelta(days=6-i)
            day_data = {
                'date': day_date.isoformat(),
                'day_name': day_date.strftime('%A'),
                'categories': {}
            }
            
            # Count consumption for each category on this day
            for category in categories:
                count = sum(
                    float(log.get('quantity', 0))
                    for log in self.food_logs
                    if log.get('category') == category
                    and datetime.fromisoformat(
                        log.get('created_at', log.get('consumed_at', ''))
                    ).date() == day_date
                )
                day_data['categories'][category] = round(count, 2)
            
            heatmap.append(day_data)
        
        return {
            'heatmap': heatmap,
            'categories': categories,
            'date_range': {
                'start': (self.today - timedelta(days=6)).isoformat(),
                'end': self.today.isoformat()
            }
        }
    
    def generate_summary(self) -> Dict[str, Any]:
        """Generate executive summary of insights."""
        consumption_patterns = self.analyze_consumption_patterns()
        waste_predictions = self.predict_waste_items()
        balance_check = self.check_dietary_balance()
        
        insights = []
        
        # Top insight: waste risk
        if waste_predictions['critical_count'] > 0:
            insights.append({
                'type': 'waste_alert',
                'priority': 'critical',
                'message': f"{waste_predictions['critical_count']} items expiring within 3 days"
            })
        
        # Dietary balance
        if not balance_check['balanced']:
            high_severity_flags = [f for f in balance_check['flags'] if f['severity'] == 'high']
            if high_severity_flags:
                insights.append({
                    'type': 'balance_alert',
                    'priority': 'high',
                    'message': high_severity_flags[0]['message']
                })
        
        # Under-consumption
        under_patterns = [p for p in consumption_patterns['patterns'] if p['type'] == 'under_consumption']
        if under_patterns:
            insights.append({
                'type': 'consumption_alert',
                'priority': 'medium',
                'message': f"Low intake detected in {len(under_patterns)} categories"
            })
        
        return {
            'insights': insights,
            'total_logs_analyzed': len(self.food_logs),
            'total_inventory_items': len(self.inventory_items),
            'analysis_period_days': 7,
            'health_score': self._calculate_health_score(balance_check, consumption_patterns)
        }
    
    def _generate_waste_recommendation(self, item_name: str, days: int, risk: str) -> str:
        """Generate recommendation for waste prevention."""
        if risk == 'critical':
            return f"Urgent: Use {item_name} today! Consider freezing or cooking immediately."
        elif risk == 'high':
            return f"Use {item_name} within {days} days. Plan a meal using this item."
        elif risk == 'medium':
            return f"Monitor {item_name}. Best used within {days} days."
        return f"Keep {item_name} fresh. Use within {days} days."
    
    def _calculate_health_score(self, balance_check: Dict, consumption_patterns: Dict) -> int:
        """Calculate overall health score (0-100)."""
        score = 100
        
        # Deduct for imbalances
        for flag in balance_check.get('flags', []):
            if flag['severity'] == 'high':
                score -= 15
            elif flag['severity'] == 'medium':
                score -= 10
            else:
                score -= 5
        
        # Deduct for consumption issues
        for pattern in consumption_patterns.get('patterns', []):
            if pattern['severity'] == 'high':
                score -= 10
            elif pattern['severity'] == 'medium':
                score -= 5
        
        return max(0, min(100, score))
